const mongoose = require('mongoose');
require('dotenv').config();

async function cleanup() {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('Error: MONGODB_URI is not defined in .env');
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB.');

        const db = mongoose.connection.db;

        // Clear contracts collection (vector store)
        console.log('Clearing "contracts" collection...');
        await db.collection('contracts').deleteMany({});

        // Clear metadata collection
        console.log('Clearing "metadata" collection...');
        await db.collection('metadata').deleteMany({});

        console.log('Cleanup complete! Database is now empty.');
        process.exit(0);
    } catch (error) {
        console.error('Cleanup failed:', error);
        process.exit(1);
    }
}

cleanup();
