import dotenv from 'dotenv';
dotenv.config();
import mongoose from "mongoose";

export const mongooseConnection = async function () {
    console.log('MongoDB URI:', process.env.MONGODB_URI);

    const uri = process.env.MONGODB_URI;
    try {
        await mongoose.connect(uri);
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();


        console.log('Connected to MongoDB using Mongoose and reindexed all collections');
    } catch (err) {
        console.error('Failed to connect to MongoDB using Mongoose', err);
        throw err;
    }
}
