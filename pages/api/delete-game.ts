/* eslint-disable @typescript-eslint/no-explicit-any */
import { MongoClient, ObjectId } from 'mongodb';

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
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { _id, id } = req.body;
    if (!_id && !id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await client.connect();
    const database = client.db('game-library');
    const collection = database.collection('games');

    let query;
    if (_id) {
      query = { _id: new ObjectId(_id) };
    } else {
      query = { id: id };
    }

    const result = await collection.deleteOne(query);
    await client.close();

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.status(200).json({ message: 'Game deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting game:', error);
    try { await client.close(); } catch {}
    res.status(500).json({ error: 'Failed to delete game', details: error.message });
  }
} 