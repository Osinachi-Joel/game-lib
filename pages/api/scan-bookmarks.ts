/* eslint-disable @typescript-eslint/no-explicit-any */
import { promises as fs } from 'fs';
import path from 'path';
import { MongoClient } from 'mongodb';
import { scanBookmarks } from '../../bookmarkScanner.js';

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
  try {
    // Run the bookmark scanner directly
    await scanBookmarks();

    const resultsDir = path.join(process.cwd(), 'booked-results');
    const files = await fs.readdir(resultsDir);
    const latestFile = files
      .filter((file: string) => file.startsWith('game_bookmarks_'))
      .sort()
      .pop();

    if (!latestFile) {
      return res.status(404).json({ error: 'No bookmarks found' });
    }

    const filePath = path.join(resultsDir, latestFile);
    const data = await fs.readFile(filePath, 'utf8');
    const bookmarks = JSON.parse(data);

    // Connect to MongoDB and store the data
    await client.connect();
    const database = client.db('game-library');
    const collection = database.collection('games');

    // Get existing game URLs to check for duplicates
    const existingGames = await collection.find({}, { projection: { url: 1 } }).toArray();
    const existingUrls = new Set(existingGames.map((game: any) => game.url));

    // Filter out duplicates and create new game documents
    const newGames = Object.values(bookmarks)
      .filter((game: any) => !existingUrls.has(game.url))
      .map((game: any) => ({
        id: Date.now() + '-' + Math.random().toString(36).substr(2, 5),
        name: game.name,
        url: game.url,
        icon: game.icon,
        createdAt: new Date()
      }));

    // Store unique games as separate documents
    if (newGames.length > 0) {
      await collection.insertMany(newGames);
    }

    await client.close();
    res.status(200).json(newGames);
  } catch (error: any) {
    console.error('Error processing bookmarks:', error);
    try { await client.close(); } catch {}
    res.status(500).json({ error: 'Failed to process bookmarks', details: error.message });
  }
}