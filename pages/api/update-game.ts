/* eslint-disable @typescript-eslint/no-explicit-any */
 
import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../lib/mongodb';
import { handleApiError, ErrorType, validateMethod } from '../../lib/api-utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Validate HTTP method
  if (!await validateMethod(req, res, ['PATCH'])) {
    return;
  }

  try {
    const { _id, id, name, url } = req.body;
    if ((!_id && !id) || (!name && !url)) {
      return await handleApiError(res, ErrorType.VALIDATION, 'Missing required fields', 'Either _id or id must be provided, and at least one of name or url');
    }

    const { db } = await connectToDatabase();
    const collection = db.collection('games');

    const updateFields: any = {};
    if (name) updateFields.name = name;
    if (url) updateFields.url = url;

    let query;
    if (_id) {
      query = { _id: new ObjectId(_id) };
    } else {
      query = { id: id };
    }

    const result = await collection.updateOne(
      query,
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return await handleApiError(res, ErrorType.NOT_FOUND, 'Game not found');
    }

    res.status(200).json({ message: 'Game updated successfully' });
  } catch (error: any) {
    await handleApiError(
      res,
      ErrorType.SERVER_ERROR,
      'Failed to update game',
      error.message,
      error
    );
  }
}