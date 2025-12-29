const mongoose = require('mongoose');
const Metadata = require('../models/Metadata');

// 1. List all documents and their extraction status
exports.listDocuments = async (req, res) => {
    try {
        const collection = mongoose.connection.db.collection("contracts");

        // aggregate on root 'source'
        const sources = await collection.aggregate([
            { $group: { _id: "$source" } }
        ]).toArray();

        const uniqueSources = sources.map(s => s._id).filter(s => s != null);

        // Fetch cached metadata for these sources
        const cachedMetadata = await Metadata.find({ source: { $in: uniqueSources } });

        const results = uniqueSources.map(source => {
            const meta = cachedMetadata.find(m => m.source === source);
            return {
                filename: source,
                isAnalyzed: !!meta,
                metadata: meta || null
            };
        });

        res.json(results);
    } catch (error) {
        console.error("List documents error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// 2. Delete a document and its metadata
exports.deleteDocument = async (req, res) => {
    try {
        const { filename } = req.params;
        if (!filename) {
            return res.status(400).json({ error: "Filename is required" });
        }

        const collection = mongoose.connection.db.collection("contracts");

        // Delete vector chunks checking both root and nested metadata
        const deleteChunks = await collection.deleteMany({
            $or: [
                { "source": filename },
                { "metadata.source": filename }
            ]
        });

        // Delete cached metadata
        const deleteMeta = await Metadata.deleteOne({ source: filename });

        res.json({
            message: `Document '${filename}' deleted successfully`,
            chunksDeleted: deleteChunks.deletedCount,
            metadataDeleted: deleteMeta.deletedCount > 0
        });
    } catch (error) {
        console.error("Delete document error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// 3. Clear all documents
exports.clearAll = async (req, res) => {
    try {
        const collection = mongoose.connection.db.collection("contracts");
        await collection.deleteMany({});
        await Metadata.deleteMany({});

        res.json({ message: "Workspace cleared successfully" });
    } catch (error) {
        console.error("Clear all error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
