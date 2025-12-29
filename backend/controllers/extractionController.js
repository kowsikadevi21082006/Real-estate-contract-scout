const { ChatCerebras } = require("@langchain/cerebras");
const mongoose = require("mongoose");
const { PromptTemplate } = require("@langchain/core/prompts");
const { StringOutputParser } = require("@langchain/core/output_parsers");

exports.extractAllMetadata = async (req, res) => {
    try {
        const collection = mongoose.connection.db.collection("contracts");

        // 1. Get unique document sources
        const uniqueSources = await collection.distinct("metadata.source");

        if (uniqueSources.length === 0) {
            return res.json([]);
        }

        const model = new ChatCerebras({
            model: "llama3.1-70b",
            temperature: 0,
            apiKey: process.env.CEREBRAS_API_KEY
        });

        const extractionResults = [];

        for (const source of uniqueSources) {
            // 2. Get the first few chunks of each document (usually contains dates/names)
            const docs = await collection.find({ "metadata.source": source }).limit(3).toArray();
            const context = docs.map(d => d.pageContent).join("\n\n");

            const promptTemplate = PromptTemplate.fromTemplate(`
                Extract key lease information from the following contract text.
                Text:
                {context}

                Return ONLY JSON with these fields:
                - property_name: (Use the address or property name if found, else use {source})
                - lease_end_date: (YYYY-MM-DD or "Not found")
                - notice_period: (e.g., "30 days", "2 months")
                - security_deposit: (e.g., "$1000")
                - source: {source}
            `);

            const chain = promptTemplate.pipe(model).pipe(new StringOutputParser());
            const result = await chain.invoke({ context, source });

            // Clean JSON
            let cleanResult = result.trim();
            if (cleanResult.startsWith("```json")) {
                cleanResult = cleanResult.replace(/^```json/, "").replace(/```$/, "").trim();
            } else if (cleanResult.startsWith("```")) {
                cleanResult = cleanResult.replace(/^```/, "").replace(/```$/, "").trim();
            }

            try {
                const parsed = JSON.parse(cleanResult);
                extractionResults.push(parsed);
            } catch (e) {
                console.error(`Failed to parse metadata for ${source}:`, cleanResult);
                extractionResults.push({
                    property_name: source,
                    lease_end_date: "Error",
                    notice_period: "Error",
                    security_deposit: "Error",
                    source: source
                });
            }
        }

        res.json(extractionResults);

    } catch (error) {
        console.error("Extraction error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
