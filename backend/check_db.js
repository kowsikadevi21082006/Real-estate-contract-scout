const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function checkDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const collection = mongoose.connection.db.collection("contracts");

        // Test new aggregate
        const sources = await collection.aggregate([
            { $group: { _id: "$source" } }
        ]).toArray();
        const uniqueSources = sources.map(s => s._id).filter(s => s != null);
        console.log('Detected Sources with root "source" field:', uniqueSources);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkDB();
