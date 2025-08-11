/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../lib/mongodb';
import { handleApiError, ErrorType, validateMethod } from '../../lib/api-utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Validate HTTP method
  if (!await validateMethod(req, res, ['DELETE'])) {
    return;
  }

  try {
    const { _id, id } = req.body;
    if (!_id && !id) {
      return await handleApiError(res, ErrorType.VALIDATION, 'Missing required fields', 'Either _id or id must be provided');
    }

    const { db } = await connectToDatabase();
    const collection = db.collection('games');

    let query;
    if (_id) {
      query = { _id: new ObjectId(_id) };
    } else {
      query = { id: id };
    }

    const result = await collection.deleteOne(query);

    if (result.deletedCount === 0) {
      return await handleApiError(res, ErrorType.NOT_FOUND, 'Game not found');
    }

    res.status(200).json({ message: 'Game deleted successfully' });
  } catch (error: any) {
    await handleApiError(
      res,
      ErrorType.SERVER_ERROR,
      'Failed to delete game',
      error.message,
      error
    );
  }
}