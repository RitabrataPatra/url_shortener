import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
// const MONGODB_DB = "shortlink"; // Replace with your database name

if (!MONGODB_URI) {
    throw new Error("Please add your MongoDB URI to .env.local");
}

let client;
let clientPromise;

if (!global._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export async function dbConnect() {
    const client = await clientPromise;  // Ensure it returns MongoClient
    return client; // Return the MongoClient instance
}
