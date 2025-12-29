const pdfParseModule = require("pdf-parse");
const pdfParse = pdfParseModule.default || pdfParseModule;
const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const { HuggingFaceTransformersEmbeddings } = require("@langchain/community/embeddings/huggingface_transformers");
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

        // ✅ 0. Clean up existing data for this filename
        // Checking both root 'source' and 'metadata.source' for safety
        await collection.deleteMany({
            $or: [
                { "source": filename },
                { "metadata.source": filename }
            ]
        });
        await Metadata.deleteOne({ source: filename });

        // ✅ 1. PDF parse
        let pdfData;
        try {
            pdfData = await pdfParse(req.file.buffer);
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

        const splitDocs = await splitter.splitDocuments(docs);

        if (!splitDocs || splitDocs.length === 0) {
            return res.status(400).json({ error: `Could not split document ${filename} into chunks.` });
        }

        // ✅ 2. Vector Indexing
        await MongoDBAtlasVectorSearch.fromDocuments(
            splitDocs,
            new HuggingFaceTransformersEmbeddings({
                modelName: "Xenova/all-MiniLM-L6-v2",
            }),
            {
                collection,
                indexName: "default",
                textKey: "pageContent",
                embeddingKey: "embedding",
            }
        );

        res.status(200).json({
            message: "File processed successfully",
            chunks: splitDocs.length,
        });

    } catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({ error: err.message });
    }
};
