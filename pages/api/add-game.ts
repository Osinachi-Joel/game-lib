/* eslint-disable @typescript-eslint/no-explicit-any */
import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MONGODB_URI to .env.local');
}

const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
  tlsAllowInvalidCertificates: process.env.NODE_ENV !== 'production',
};

const client = new MongoClient(process.env.MONGODB_URI, mongoOptions);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const game = req.body;

    // Connect to MongoDB
    await client.connect();
    const database = client.db('game-library');
    const collection = database.collection('games');

    // Check for duplicate by URL
    const existing = await collection.findOne({ url: game.url });
    if (existing) {
      await client.close();
      return res.status(409).json({ error: 'DUPLICATE_GAME' });
    }

    // Create new game document
    const newGame = {
      id: game.id,
      name: game.name,
      url: game.url,
      icon: game.icon,
      createdAt: new Date()
    };

    // Store the game as a single document
    await collection.insertOne(newGame);
    await client.close();
    res.status(200).json({ message: 'Game added successfully' });
  } catch (error: any) {
    console.error('Error adding game:', error);
    try { await client.close(); } catch {}
    res.status(500).json({ error: 'Failed to add game', details: error.message });
  }
}