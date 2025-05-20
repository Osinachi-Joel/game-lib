import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  data: {
    results: Array<{
      id: number;
      slug: string;
      name: string;
      released: string;
      background_image: string;
      rating: number;
    }>;
    count: number;
  } | null;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const apiKey = process.env.RAWG_API_KEY;
    if (!apiKey) {
      throw new Error('RAWG API key is not configured');
    }

    const { search } = req.query;
    const searchParam = search ? `&search=${encodeURIComponent(search as string)}&search_precise=true` : '';

    const response = await fetch(`https://api.rawg.io/api/games?key=${apiKey}${searchParam}`);
    const data = await response.json();

    res.status(200).json({ data });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    res.status(500).json({ data: null, error: 'Failed to fetch games data' });
  }
}