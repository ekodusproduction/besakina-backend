import { getDB } from "./mongodb";
const reindexCollections = async () => {
    try {
        const db = getDB();
        const collections = await db.listCollections().toArray();
        for (const collection of collections) {
            console.log("Reindexing " + collection.name);
            await db.collection(collection.name).reIndex();
        }
        console.log("Reindexing completed.");
    } catch (err) {
        console.error("Failed to reindex collections", err);
    }
};