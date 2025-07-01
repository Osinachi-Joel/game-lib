import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MONGODB_URI to .env.local');
}

const client = new MongoClient(process.env.MONGODB_URI);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await client.connect();
    const database = client.db('game-library');
    const collection = database.collection('games');

    // Fetch all games and sort by name
    const games = await collection.find({}).sort({ name: 1 }).toArray();

    await client.close();

    if (!games.length) {
      return res.status(404).json({ error: 'No games found' });
    }

    res.status(200).json(games);

  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
}