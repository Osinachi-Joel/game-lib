/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/db';
import Game from '../../models/Game';
import { handleApiError, ErrorType, validateMethod } from '../../lib/api-utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Validate HTTP method
  if (!await validateMethod(req, res, ['PATCH'])) {
    return;
  }

  try {
    const { _id, id, name, url, icon, platform, coverImage } = req.body;
    if ((!_id && !id) || (!name && !url && !icon && !platform && !coverImage)) {
      return await handleApiError(res, ErrorType.VALIDATION, 'Missing required fields', 'Either _id or id must be provided, and at least one field to update');
    }

    await connectToDatabase();

    const updateFields: any = {};
    if (name) updateFields.name = name;
    if (url) updateFields.url = url;
    if (icon) updateFields.icon = icon;
    if (platform) updateFields.platform = platform;
    if (coverImage) updateFields.coverImage = coverImage;

    let query;
    if (_id) {
      query = { _id }; // Mongoose handles ObjectId conversion automatically if string passed
    } else {
      query = { id: id };
    }

    const result = await Game.findOneAndUpdate(query, { $set: updateFields }, { new: true });

    if (!result) {
      return await handleApiError(res, ErrorType.NOT_FOUND, 'Game not found');
    }

    res.status(200).json({ message: 'Game updated successfully', game: result });
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