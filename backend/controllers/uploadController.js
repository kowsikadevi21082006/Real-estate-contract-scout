const pdfParseModule = require("pdf-parse");
const pdfParse = pdfParseModule.default || pdfParseModule;
const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const { HuggingFaceTransformersEmbeddings } = require("@langchain/community/embeddings/huggingface_transformers");
const { MongoDBAtlasVectorSearch } = require("@langchain/mongodb");
const mongoose = require("mongoose");

exports.uploadPDF = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // ✅ PDF parse
        let pdfData;
        try {
            pdfData = await pdfParse(req.file.buffer);
        } catch (parseError) {
            console.error("PDF Parsing failed:", parseError);
            throw new Error(`PDF Parsing failed: ${parseError.message}`);
        }

        const docs = [
            {
                pageContent: pdfData.text,
                metadata: {
                    source: req.file.originalname,
                    uploadedAt: new Date(),
                },
            },
        ];

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        const splitDocs = await splitter.splitDocuments(docs);

        const collection = mongoose.connection.db.collection("contracts");

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
