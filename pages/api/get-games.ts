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
    const collection = database.collection('bookmarks');

    const latestBookmarks = await collection.findOne(
      {},
      { sort: { timestamp: -1 } }
    );

    await client.close();

    if (!latestBookmarks) {
      return res.status(404).json({ error: 'No bookmarks found' });
    }

    // Transform the bookmarks object into an array with IDs
    const bookmarksObj = latestBookmarks?.bookmarks || {};
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    const bookmarksArray = Object.entries(bookmarksObj).map(([name, game]: [string, any]) => ({
      id: Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      name: game.name,
      url: game.url,
      icon: game.icon
    })).sort((a, b) => a.name.localeCompare(b.name));

    res.status(200).json(bookmarksArray);

  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
}