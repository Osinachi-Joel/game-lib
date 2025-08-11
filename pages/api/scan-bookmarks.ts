/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import { connectToDatabase } from '../../lib/mongodb';
import { scanBookmarks } from '../../bookmarkScanner.js';
import { handleApiError, ErrorType } from '../../lib/api-utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
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
      return await handleApiError(res, ErrorType.NOT_FOUND, 'No bookmarks found');
    }

    const filePath = path.join(resultsDir, latestFile);
    const data = await fs.readFile(filePath, 'utf8');
    const bookmarks = JSON.parse(data);

    // Connect to MongoDB and store the data
    const { db } = await connectToDatabase();
    const collection = db.collection('games');

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

    res.status(200).json(newGames);
  } catch (error: any) {
    await handleApiError(
      res,
      ErrorType.SERVER_ERROR,
      'Failed to process bookmarks',
      error.message,
      error
    );
  }
}