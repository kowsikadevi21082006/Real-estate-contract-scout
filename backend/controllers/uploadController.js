const pdfParseModule = require("pdf-parse");
const pdfParse = pdfParseModule.default || pdfParseModule;
const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const { CerebrasEmbeddings } = require("@langchain/cerebras");
const { MongoDBAtlasVectorSearch } = require("@langchain/mongodb");
const mongoose = require("mongoose");
const Metadata = require("../models/Metadata");

exports.uploadPDF = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const collection = mongoose.connection.db.collection("contracts");
        const filename = req.file.originalname;
        console.log(`[Upload Controller] Starting upload for file: ${filename}`);

        // ✅ 0. Clean up existing data for this filename
        // Checking both root 'source' and 'metadata.source' for safety
        await collection.deleteMany({
            $or: [
                { "source": filename },
                { "metadata.source": filename }
            ]
        });
        await Metadata.deleteOne({ source: filename });
        console.log(`[Upload Controller] Cleaned up existing data for ${filename}`);

        // ✅ 1. PDF parse
        let pdfData;
        try {
            console.log(`[Upload Controller] Parsing PDF for ${filename}...`);
            pdfData = await pdfParse(req.file.buffer);
            console.log(`[Upload Controller] PDF parsed for ${filename}. Text length: ${pdfData.text ? pdfData.text.length : 0}`);
        } catch (parseError) {
            console.error("PDF Parsing failed:", parseError);
            if (parseError.message.includes("bad XRef entry")) {
                return res.status(400).json({
                    error: `PDF Parsing failed for "${filename}". Corrupted or unsupported PDF format.`
                });
            }
            return res.status(500).json({ error: `PDF Parsing failed: ${parseError.message}` });
        }

        if (!pdfData.text || pdfData.text.trim().length === 0) {
            return res.status(400).json({ error: `The file "${filename}" contains no extractable text.` });
        }

        const docs = [
            {
                pageContent: pdfData.text,
                metadata: {
                    source: filename,
                    uploadedAt: new Date(),
                },
            },
        ];

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        console.log(`[Upload Controller] Splitting document ${filename} into chunks...`);
        const splitDocs = await splitter.splitDocuments(docs);
        console.log(`[Upload Controller] Document split. Number of chunks: ${splitDocs.length}`);


        if (!splitDocs || splitDocs.length === 0) {
            return res.status(400).json({ error: `Could not split document ${filename} into chunks.` });
        }

        // ✅ 2. Vector Indexing
        try {
            console.log(`[Upload Controller] Starting vector indexing for ${filename} with ${splitDocs.length} chunks...`);
            await MongoDBAtlasVectorSearch.fromDocuments(
                splitDocs,
                new CerebrasEmbeddings({
                    apiKey: process.env.CEREBRAS_API_KEY
                }),
                {
                    collection,
                    indexName: "default",
                    textKey: "pageContent",
                    embeddingKey: "embedding",
                }
            );
            console.log(`[Upload Controller] Vector indexing completed for ${filename}.`);
        } catch (indexingError) {
            console.error(`[Upload Controller] Vector indexing failed for ${filename}:`, indexingError);
            return res.status(500).json({ error: `Vector indexing failed for ${filename}: ${indexingError.message}` });
        }

        res.status(200).json({
            message: "File processed successfully",
            chunks: splitDocs.length,
        });

    } catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({ error: err.message });
    }
};
