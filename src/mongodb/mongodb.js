import dotenv from 'dotenv';
dotenv.config();
import { MongoClient } from "mongodb";

const url = process.env.MONGODB_URI;

let client;

export const connectToMongoDB = async () => {
    try {
        client = await MongoClient.connect(url);
        // const db = client.db();
        const collections = await client.listCollections().toArray();

        console.log("Collections:");
        collections.forEach(collection => {
            console.log(collection.name);
        });
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
