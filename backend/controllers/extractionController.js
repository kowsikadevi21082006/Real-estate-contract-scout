const { ChatCerebras } = require("@langchain/cerebras");
const mongoose = require("mongoose");
const { PromptTemplate } = require("@langchain/core/prompts");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const Metadata = require("../models/Metadata");

exports.extractAllMetadata = async (req, res) => {
    try {
        const collection = mongoose.connection.db.collection("contracts");

        // 1. Get unique source names (checking root 'source' field)
        const sources = await collection.aggregate([
            { $group: { _id: "$source" } }
        ]).toArray();

        const uniqueSources = sources.map(s => s._id).filter(s => s != null);
        console.log(`Starting extraction for ${uniqueSources.length} sources:`, uniqueSources);

        if (uniqueSources.length === 0) {
            return res.json([]);
        }

        // 2. Fetch existing metadata from DB
        const cachedMetadata = await Metadata.find({ source: { $in: uniqueSources } });
        const cachedSources = cachedMetadata.map(m => m.source);

        // 3. Identify sources that need AI extraction
        const sourcesToAnalyze = uniqueSources.filter(s => !cachedSources.includes(s));

        if (sourcesToAnalyze.length === 0) {
            console.log("Returning all metadata from cache.");
            return res.json(cachedMetadata);
        }

        console.log(`Analyzing ${sourcesToAnalyze.length} new sources...`);

        const model = new ChatCerebras({
            model: "llama3.1-70b",
            temperature: 0,
            apiKey: process.env.CEREBRAS_API_KEY
        });

        // 4. Perform AI extraction for new sources
        const newExtractions = await Promise.all(sourcesToAnalyze.map(async (source) => {
            try {
                // Get the first few chunks using root 'source' field
                const docs = await collection.find({ "source": source }).limit(5).toArray();
                const context = docs.map(d => d.pageContent).join("\n\n");

                if (!context) return null;

                const promptTemplate = PromptTemplate.fromTemplate(`
                    You are a legal data extractor. Analyze the contract text and return ONLY JSON.
                    Text: {context}

                    JSON Fields:
                    - property_name: (Short address or property name)
                    - lease_end_date: (YYYY-MM-DD or "Not found")
                    - notice_period: (e.g., "30 days", "2 months")
                    - security_deposit: (Amount e.g. "$1000")
                    - red_flags: (Briefly describe any illegal or high-risk clauses, else "None detected")
                    - source: {source}
                `);

                const chain = promptTemplate.pipe(model).pipe(new StringOutputParser());
                const result = await chain.invoke({ context, source });

                let cleanResult = result.trim();
                if (cleanResult.includes("```")) {
                    cleanResult = cleanResult.replace(/```json/g, "").replace(/```/g, "").trim();
                }

                try {
                    const parsed = JSON.parse(cleanResult);
                    const finalData = { ...parsed, source: source };

                    // Save to database
                    await Metadata.findOneAndUpdate(
                        { source: source },
                        finalData,
                        { upsert: true, new: true }
                    );

                    return finalData;
                } catch (e) {
                    console.error(`JSON Parse error for ${source}:`, cleanResult);
                    return {
                        property_name: source,
                        lease_end_date: "Not found",
                        notice_period: "Not found",
                        security_deposit: "Not found",
                        red_flags: "Error parsing AI response",
                        source: source
                    };
                }
            } catch (err) {
                console.error(`Error extracting from ${source}:`, err);
                return null;
            }
        }));

        // Combine cached and new results
        const finalResults = [...cachedMetadata, ...newExtractions.filter(r => r !== null)];
        res.json(finalResults);

    } catch (error) {
        console.error("Extraction error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
