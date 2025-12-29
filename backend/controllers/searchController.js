const { HuggingFaceTransformersEmbeddings } = require("@langchain/community/embeddings/huggingface_transformers");
const { ChatCerebras } = require("@langchain/cerebras");
const { MongoDBAtlasVectorSearch } = require("@langchain/mongodb");
const mongoose = require("mongoose");
const { PromptTemplate } = require("@langchain/core/prompts");
const { StringOutputParser } = require("@langchain/core/output_parsers");

exports.compareContracts = async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ error: "Query is required" });
        }

        // 1. Setup Vector Store
        const collection = mongoose.connection.db.collection("contracts");
        const vectorStore = new MongoDBAtlasVectorSearch(new HuggingFaceTransformersEmbeddings({
            modelName: "Xenova/all-MiniLM-L6-v2",
        }), {
            collection,
            indexName: "default",
            textKey: "pageContent",
            embeddingKey: "embedding",
        });

        // 2. Retrieve relevant chunks
        // Focus on retrieving chunks that represent a diverse set of documents if possible.
        // For now, we increase the k to get more context.
        const retriever = vectorStore.asRetriever(15);
        const relevantDocs = await retriever.invoke(query);

        // 3. Construct Context with source tracking
        const context = relevantDocs.map(d =>
            `--- DOCUMENT START ---\nSource: ${d.metadata.source}\nContent: ${d.pageContent}\n--- DOCUMENT END ---`
        ).join("\n\n");

        // 4. Call LLM for Comparison (Cerebras)
        const model = new ChatCerebras({
            model: "llama3.1-70b",
            temperature: 0,
            apiKey: process.env.CEREBRAS_API_KEY
        });

        const promptTemplate = PromptTemplate.fromTemplate(`
      You are a specialized legal assistant focusing on real estate contracts.
      User Query: {query}
      
      INSTRUCTIONS:
      1. Analyze the provided contract excerpts (Context).
      2. For each unique document identified by its Source name:
         - Extract the relevant details as requested by the User Query.
         - Identify any "Red Flags": high risks, unusual clauses, or terms that might be illegal or highly unfavorable (e.g., excessive deposits, hidden fees, unfair termination clauses).
      3. If a document doesn't contain information related to the query, still include it but state "Information not found".
      4. Return ONLY valid JSON as an array of objects. Do not include any conversational text.

      Format:
      [
        {{
          "property": "filename.pdf",
          "details": "Clear summary of the specific clauses requested",
          "red_flags": "Description of risks or 'None detected'"
        }}
      ]

      Context:
      {context}
    `);

        const chain = promptTemplate.pipe(model).pipe(new StringOutputParser());

        const result = await chain.invoke({ query, context });

        // Clean up markdown code blocks if present
        let cleanResult = result.trim();
        if (cleanResult.startsWith("```json")) {
            cleanResult = cleanResult.replace(/^```json/, "").replace(/```$/, "").trim();
        } else if (cleanResult.startsWith("```")) {
            cleanResult = cleanResult.replace(/^```/, "").replace(/```$/, "").trim();
        }

        try {
            const parsedResult = JSON.parse(cleanResult);
            res.json(parsedResult);
        } catch (parseError) {
            console.error("JSON Parsing failed:", cleanResult);
            res.status(500).json({ error: "LLM output was not valid JSON", raw: cleanResult });
        }

    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
