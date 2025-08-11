import { Db, MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MONGODB_URI to .env.local');
}

// Updated MongoDB connection options without deprecated options
const mongoOptions = {
  tls: true,
  tlsAllowInvalidCertificates: true,
};

// Create a cached connection variable
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  try {
    // If we have a cached connection, use it
    if (cachedClient && cachedDb) {
      return { client: cachedClient, db: cachedDb };
    }

    // Create a new client and connect
    const client = new MongoClient(process.env.MONGODB_URI!, mongoOptions);
    await client.connect();
    const db = client.db('game-library');

    // Cache the client and db connections
    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to database');
  }
}

// Helper function to close connection if needed
export async function closeConnection() {
  try {
    if (cachedClient) {
      await cachedClient.close();
      cachedClient = null;
      cachedDb = null;
    }
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    // Reset the cache even if there was an error closing
    cachedClient = null;
    cachedDb = null;
  }
}