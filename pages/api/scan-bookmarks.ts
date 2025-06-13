import { promises as fs } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  try {
    // Run the bookmark scanner script
    await execAsync('node bookmarkScanner.js');

    const resultsDir = path.join(process.cwd(), 'booked-results');
    const files = await fs.readdir(resultsDir);
    const latestFile = files
      .filter(file => file.startsWith('game_bookmarks_'))
      .sort()
      .pop();

    if (!latestFile) {
      return res.status(404).json({ error: 'No bookmarks found' });
    }

    const filePath = path.join(resultsDir, latestFile);
    const data = await fs.readFile(filePath, 'utf8');
    res.status(200).json(JSON.parse(data));
  } catch (error) {
    console.error('Error processing bookmarks:', error);
    res.status(500).json({ error: 'Failed to process bookmarks' });
  }
}