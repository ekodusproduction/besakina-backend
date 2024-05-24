import dotenv from 'dotenv';
dotenv.config();
import { MongoClient } from "mongodb"

const url = process.env.MONGODB_URI;

let client;

// 3. Function to connect to the database
export const connectToMongoDB = async () => {
    try {
        client = await MongoClient.connect(url);
        client.db().getCollectionNames().forEach(function (collectionName) {
            print("Reindexing " + collectionName);
            db.getCollection(collectionName).reIndex();
        });
        console.log("Connected to MongoDB using native driver!");
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
    }
};

// 4. Function to access the database
export const getDB = () => {
    if (!client) {
        throw new Error("You must connect to MongoDB first!");
    }
    return client.db();
};
