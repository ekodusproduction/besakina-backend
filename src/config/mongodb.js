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
        db.collection('businesses').createIndex({ street: 'text', locality: 'text', city: 'text', state: 'text', pincode: 'text', name: 'text', description: 'text', category: 'text' });
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
