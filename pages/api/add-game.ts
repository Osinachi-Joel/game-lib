import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MONGODB_URI to .env.local');
}

const client = new MongoClient(process.env.MONGODB_URI);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const game = req.body;

    // Connect to MongoDB
    await client.connect();
    const database = client.db('game-library');
    const collection = database.collection('bookmarks');
    
    // Get the latest bookmarks document
    const latestBookmarks = await collection.findOne(
      {},
      { sort: { timestamp: -1 } }
    );

    // Get existing games and add the new one
    const existingGames = latestBookmarks?.bookmarks || [];
    const newGame = {
      id: game.id,
      name: game.name,
      url: game.url,
      icon: game.icon
    };

    // Store updated games array
    await collection.insertOne({
      bookmarks: [...existingGames, newGame],
      timestamp: new Date()
    });
    
    await client.close();
    res.status(200).json({ message: 'Game added successfully' });
  } catch (error) {
    console.error('Error adding game:', error);
    res.status(500).json({ error: 'Failed to add game' });
  }
}