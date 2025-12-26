const { OpenAIEmbeddings, ChatOpenAI } = require("@langchain/openai");
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
        const vectorStore = new MongoDBAtlasVectorSearch(new OpenAIEmbeddings(), {
            collection,
            indexName: "default",
            textKey: "text",
            embeddingKey: "embedding",
        });

        // 2. Retrieve relevant chunks
        // We want to fetch enough chunks to cover multiple documents.
        const retriever = vectorStore.asRetriever(10);
        const relevantDocs = await retriever.invoke(query);

        // 3. Construct Context
        const context = relevantDocs.map(d =>
            `Source: ${d.metadata.source}\nContent: ${d.pageContent}`
        ).join("\n\n");

        // 4. Call LLM for Comparison
        const model = new ChatOpenAI({
            modelName: "gpt-4o",
            temperature: 0
        });

        const promptTemplate = PromptTemplate.fromTemplate(`
      You are a legal contract assistant.
      User Query: {query}
      
      Based on the following contract excerpts, compare the documents.
      Return the output ONLY as a JSON array of objects, where each object represents a property/document.
      Format: [{{ "property": "filename", "details": "summary of clause" }}, ...]

      Context:
      {context}
    `);

        const chain = promptTemplate.pipe(model).pipe(new StringOutputParser());

        const result = await chain.invoke({ query, context });

        // Clean up markdown code blocks if present
        const cleanResult = result.replace(/```json/g, "").replace(/```/g, "").trim();

        res.json(JSON.parse(cleanResult));

    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
