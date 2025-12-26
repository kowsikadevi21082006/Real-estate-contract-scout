const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { OpenAIEmbeddings } = require("@langchain/openai");
const { MongoDBAtlasVectorSearch } = require("@langchain/mongodb");
const mongoose = require("mongoose");
const fs = require("fs");

exports.uploadPDF = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const filePath = req.file.path;

        // 1. Load PDF
        const loader = new PDFLoader(filePath);
        const docs = await loader.load();

        // 2. Split into chunks
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });
        const splitDocs = await splitter.splitDocuments(docs);

        // 3. Add metadata (standardize)
        const processedDocs = splitDocs.map((doc) => ({
            pageContent: doc.pageContent,
            metadata: {
                source: req.file.originalname,
                uploadedAt: new Date(),
                ...doc.metadata,
            },
        }));

        // 4. Embed and Store in MongoDB
        // Note: We assume the collection 'contracts' works with the vector index.
        const collection = mongoose.connection.db.collection("contracts");

        await MongoDBAtlasVectorSearch.fromDocuments(
            processedDocs,
            new OpenAIEmbeddings(),
            {
                collection,
                indexName: "default", // Ensure this matches user's Atlas setup
                textKey: "text",
                embeddingKey: "embedding",
            }
        );

        // Clean up file
        fs.unlinkSync(filePath);

        res.status(200).json({
            message: "File processing complete",
            chunks: processedDocs.length
        });

    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
