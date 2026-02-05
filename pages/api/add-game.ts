/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/db';
import Game from '../../models/Game';
import { handleApiError, ErrorType, validateMethod } from '../../lib/api-utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Validate HTTP method
  if (!await validateMethod(req, res, ['POST'])) {
    return;
  }

  try {
    const game = req.body;

    await connectToDatabase();

    // Check for duplicate by URL
    const existing = await Game.findOne({ url: game.url });
    if (existing) {
      return await handleApiError(res, ErrorType.DUPLICATE, 'Game already exists', 'A game with this URL already exists in the database');
    }

    // Create new game document
    const newGame = await Game.create({
      id: game.id,
      name: game.name,
      url: game.url,
      icon: game.icon,
      // Add other fields if present in req.body, e.g., platform, coverImage
      platform: game.platform,
      coverImage: game.coverImage
    });

    res.status(200).json({ message: 'Game added successfully', game: newGame });
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