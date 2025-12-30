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
            model: "llama-3.3-70b",
            temperature: 0,
            apiKey: process.env.CEREBRAS_API_KEY
        });

        // 4. Perform AI extraction for new sources
        const newExtractions = await Promise.all(sourcesToAnalyze.map(async (source) => {
            try {
                // Get the first few chunks using root 'source' field
                const docs = await collection.find({ "source": source }).limit(15).toArray();
                const context = docs.map(d => d.pageContent).join("\n\n");

                console.log(`[Extraction Controller] Context for ${source} (first 500 chars):\n${context.substring(0, 500)}...`);

                if (!context) return null;

                const promptTemplate = PromptTemplate.fromTemplate(`
                    You are a highly skilled legal data extractor. Your task is to analyze the provided contract text and extract specific details.
                    Always return ONLY valid JSON.

                    If a field is explicitly present in the text, extract its value. If it's not found, explicitly state "Not found".
                    Prioritize finding exact matches for dates, amounts, and specific periods.

                    Text: {context}

                    JSON Fields to Extract:
                    - property_name: (Identify a short, descriptive name for the property or address from the document. If not found, use the source filename as a fallback.)
                    - lease_end_date: (Extract the termination date of the lease in YYYY-MM-DD format. If no specific date is found, state "Not found".)
                    - notice_period: (Identify the required notice period for termination, e.g., "30 days", "2 months". If not found, state "Not found".)
                    - security_deposit: (Extract the exact security deposit amount, e.g., "$1000", "Two months' rent". If not found, state "Not found".)
                    - red_flags: (Briefly describe any clauses that appear unusual, high-risk, or potentially illegal based on general real estate law principles. If no such clauses are detected, state "None detected".)
                    - source: {source} (This is the original filename of the document)
                `);

                const chain = promptTemplate.pipe(model).pipe(new StringOutputParser());
                console.log(`[Extraction Controller] Invoking LLM for source: ${source}`);
                const result = await chain.invoke({ context, source });
                console.log(`[Extraction Controller] LLM invoked for source: ${source}. Raw result length: ${result ? result.length : 0}`);
                console.log(`[Extraction Controller] Raw LLM result for ${source}:`, result);

                let cleanResult = result.trim();
                if (cleanResult.includes("```")) {
                    cleanResult = cleanResult.replace(/```json/g, "").replace(/```/g, "").trim();
                }

                try {
                    const parsed = JSON.parse(cleanResult);
                    // Filter parsed data to match Metadata schema keys explicitly
                    const finalData = {
                        property_name: parsed.property_name || source, // Use source as fallback
                        lease_end_date: parsed.lease_end_date || "Not found",
                        notice_period: parsed.notice_period || "Not found",
                        security_deposit: parsed.security_deposit || "Not found",
                        red_flags: parsed.red_flags || "None detected",
                        source: source,
                        extractedAt: new Date()
                    };

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
