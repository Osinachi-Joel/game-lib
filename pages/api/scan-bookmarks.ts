/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import connectToDatabase from '../../lib/db';
import Game from '../../models/Game';
import { scanBookmarks } from '../../bookmarkScanner.js';
import { handleApiError, ErrorType } from '../../lib/api-utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  try {
    // Run the bookmark scanner directly - this will create a results file even if no bookmarks are found
    await scanBookmarks();

    // Get the latest results file
    const resultsDir = path.join(process.cwd(), 'booked-results');
    let files;
    try {
      files = await fs.readdir(resultsDir);
    } catch (error) {
      console.error('Error reading results directory:', error);
      return await handleApiError(res, ErrorType.SERVER_ERROR, 'Failed to read bookmark results directory');
    }

    const latestFile = files
      .filter((file: string) => file.startsWith('game_bookmarks_'))
      .sort()
      .pop();

    if (!latestFile) {
      return await handleApiError(res, ErrorType.NOT_FOUND, 'No bookmarks found');
    }

    // Read the bookmarks file
    const filePath = path.join(resultsDir, latestFile);
    let data, bookmarks;
    try {
      data = await fs.readFile(filePath, 'utf8');
      bookmarks = JSON.parse(data);
    } catch (error: any) {
      console.error('Error reading bookmark file:', error);
      return await handleApiError(res, ErrorType.SERVER_ERROR, 'Failed to read bookmark file', error.message, error);
    }

    // If there are no bookmarks, return empty array without connecting to MongoDB
    if (!bookmarks || !Array.isArray(bookmarks) || bookmarks.length === 0) {
      console.log('No bookmarks to process, skipping MongoDB connection');
      return res.status(200).json([]);
    }

    // Connect to MongoDB and store the data
    try {
      await connectToDatabase();

      // Get existing game URLs to check for duplicates
      const existingGames = await Game.find({}, 'url').lean();
      const existingUrls = new Set(existingGames.map((game: any) => game.url));

      // Filter out duplicates and create new game documents
      const newGames = Object.values(bookmarks)
        .filter((game: any) => game && game.url && !existingUrls.has(game.url))
        .map((game: any) => ({
          id: Date.now() + '-' + Math.random().toString(36).substr(2, 5),
          name: game.name || 'Unknown Game',
          url: game.url,
          icon: game.icon
        }));

      // Store unique games as separate documents
      if (newGames.length > 0) {
        await Game.insertMany(newGames);
        console.log(`Added ${newGames.length} new games to database`);
      } else {
        console.log('No new games to add to database');
      }

      return res.status(200).json(newGames);
    } catch (dbError: any) {
      console.error('MongoDB operation error:', dbError);
      return await handleApiError(
        res,
        ErrorType.SERVER_ERROR,
        'Database operation failed',
        dbError.message,
        dbError
      );
    }
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