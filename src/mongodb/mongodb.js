import dotenv from 'dotenv';
dotenv.config();
import { MongoClient } from "mongodb";

const url = process.env.MONGODB_URI;

let client;

export const connectToMongoDB = async () => {
    try {
        client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db();

        // Reindexing all collections
        const collections = await db.listCollections().toArray();
        for (let collection of collections) {
            console.log("Reindexing " + collection.name);
            await db.collection(collection.name).reIndex();
        }

        console.log("Connected to MongoDB using native driver!");
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
