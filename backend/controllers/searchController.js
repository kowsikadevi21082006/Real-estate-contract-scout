const { CerebrasEmbeddings } = require("@langchain/cerebras");
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
        const vectorStore = new MongoDBAtlasVectorSearch(new CerebrasEmbeddings({
            apiKey: process.env.CEREBRAS_API_KEY
        }), {
            collection,
            indexName: "default",
            textKey: "pageContent",
            embeddingKey: "embedding",
        });

        // 2. Retrieve relevant chunks
        const retriever = vectorStore.asRetriever(15);
        const relevantDocs = await retriever.invoke(query);

        // 3. Construct Context with source tracking
        // LangChain typically puts root mapped fields into .metadata on the JS object
        const context = relevantDocs.map(d => {
            const sourceName = d.metadata.source || d.metadata._id || "Unknown Source";
            return `--- DOCUMENT START ---\nSource: ${sourceName}\nContent: ${d.pageContent}\n--- DOCUMENT END ---`;
        }).join("\n\n");

        // 4. Call LLM for Comparison (Cerebras)
        const model = new ChatCerebras({
            model: "llama-3.3-70b",
            temperature: 0,
            apiKey: process.env.CEREBRAS_API_KEY
        });

        const promptTemplate = PromptTemplate.fromTemplate(`
      You are a specialized legal assistant focusing on real estate contracts.
      User Query: {query}
      
      INSTRUCTIONS:
      1. Analyze the provided contract excerpts (Context).
      2. For each unique document identified by its Source name, extract the relevant details as requested by the User Query.
      3. Identify any "Red Flags": high risks, unusual clauses, or terms that might be illegal or highly unfavorable. If none, state "None detected".
      4. If a document doesn't contain information related to the query, still include it but state "Information not found" for the details and "None detected" for red_flags.
      5. Return ONLY valid JSON as an array of objects, with NO conversational text, preamble, or markdown code block fences (e.g., \`\`\`json or \`\`\`).

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
        console.log(`[Search Controller] Invoking LLM for query: ${query}`);
        const result = await chain.invoke({ query, context });
        console.log(`[Search Controller] LLM invoked for query: ${query}. Raw result length: ${result ? result.length : 0}`);
        console.log(`[Search Controller] Raw LLM result for ${query}:`, result);

        let cleanResult = result.trim();
        if (cleanResult.startsWith("```json")) {
            cleanResult = cleanResult.replace(/^```json/, "").replace(/```$/, "").trim();
        } else if (cleanResult.startsWith("```")) {
            cleanResult = cleanResult.replace(/^```/, "").replace(/```$/, "").trim();
        }

        // Fallback for cases where LLM might put json in middle of text, unlikely with current prompt but safe
        const jsonMatch = cleanResult.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
            cleanResult = jsonMatch[1].trim();
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
