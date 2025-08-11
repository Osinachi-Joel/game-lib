/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../lib/mongodb';
import { handleApiError, ErrorType, validateMethod } from '../../lib/api-utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Validate HTTP method
  if (!await validateMethod(req, res, ['POST'])) {
    return;
  }

  try {
    const game = req.body;

    // Connect to MongoDB
    const { db } = await connectToDatabase();
    const collection = db.collection('games');

    // Check for duplicate by URL
    const existing = await collection.findOne({ url: game.url });
    if (existing) {
      return await handleApiError(res, ErrorType.DUPLICATE, 'Game already exists', 'A game with this URL already exists in the database');
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
    res.status(200).json({ message: 'Game added successfully' });
  } catch (error: any) {
    await handleApiError(
      res,
      ErrorType.SERVER_ERROR,
      'Failed to add game',
      error.message,
      error
    );
  }
}