import dotenv from 'dotenv';
dotenv.config();
import { MongoClient } from "mongodb";

const url = process.env.MONGODB_URI;

let client;

export const connectToMongoDB = async () => {
    try {
        console.log('MongoDB URI:', process.env.MONGODB_URI);

        client = await MongoClient.connect(url);
        const db = client.db();
        console.log("Connected to MongoDB using native driver!");

        // Reindex all collections
        const collections = await db.listCollections().toArray();
        for (const collection of collections) {
            const collectionName = collection.name;
            console.log(`Reindexing collection: ${collectionName}`);
            await db.collection(collectionName).reIndex();
            console.log(`Reindexed collection: ${collectionName}`);
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
