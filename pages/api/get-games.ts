/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../lib/mongodb';
import { handleApiError, ErrorType, validateMethod } from '../../lib/api-utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Validate HTTP method
  if (!await validateMethod(req, res, ['GET'])) {
    return;
  }

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('games');

    // Fetch all games and sort by name
    const games = await collection.find({}).sort({ name: 1 }).toArray();

    if (!games.length) {
      return await handleApiError(res, ErrorType.NOT_FOUND, 'No games found');
    }

    res.status(200).json(games);

  } catch (error: any) {
    await handleApiError(
      res, 
      ErrorType.SERVER_ERROR, 
      'Failed to fetch games', 
      error.message, 
      error
    );
  }
}