import dotenv from 'dotenv';
dotenv.config();
import { MongoClient } from "mongodb";

const url = process.env.MONGODB_URI;

let client;

export const connectToMongoDB = async () => {
    try {
        console.log('MongoDB URI:', process.env.MONGODB_URI);

        client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db();
        console.log("Connected to MongoDB using native driver!");

        // Reindex all collections (if necessary and supported)
        const collections = await db.listCollections().toArray();
        console.log("Collections:");
        for (const collection of collections) {
            console.log(`Collection: ${collection.name}`);
            const col = db.collection(collection.name);
            await col.reIndex(); // This is supported only in standalone mode and may be deprecated in the future
            console.log(`Reindexed collection: ${collection.name}`);
        }

    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
        throw err;
    }
};

export const getDB = () => {
    if (!client) {
        throw new Error("You must connect to MongoDB first!");
    }
    return client.db();
};
