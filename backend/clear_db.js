const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function clearDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const collection = mongoose.connection.db.collection("contracts"); // Using the raw collection

        // Also clear 'metadatas' if it exists (mongoose model usually pluralizes)
        // Let's check the models to be sure, but deleting from the collection used in check_db is a safe bet.

        const deleteResult = await collection.deleteMany({});
        console.log(`Deleted ${deleteResult.deletedCount} documents from 'contracts' collection.`);

        // If there's a separate metadata collection (based on Metadata.js model), clear that too.
        // Usually mongoose models: Metadata -> metadatas
        const metadataCollection = mongoose.connection.db.collection("metadatas");
        const metaDeleteResult = await metadataCollection.deleteMany({});
        console.log(`Deleted ${metaDeleteResult.deletedCount} documents from 'metadatas' collection.`);

        process.exit(0);
    } catch (err) {
        console.error("Error clearing DB:", err);
        process.exit(1);
    }
}

clearDB();
