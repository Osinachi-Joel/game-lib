/* eslint-disable @typescript-eslint/no-explicit-any */
 
import { MongoClient, ObjectId } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MONGODB_URI to .env.local');
}

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req: any, res: any) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { _id, id, name, url } = req.body;
    if ((!_id && !id) || (!name && !url)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await client.connect();
    const database = client.db('game-library');
    const collection = database.collection('games');

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
    await client.close();

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.status(200).json({ message: 'Game updated successfully' });
  } catch (error) {
    console.error('Error updating game:', error);
    res.status(500).json({ error: 'Failed to update game' });
  }
}