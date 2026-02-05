/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import connectToDatabase from '../../lib/db';
import Game from '../../models/Game';
import { handleApiError, ErrorType, validateMethod } from '../../lib/api-utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Allow POST or DELETE
    // Using POST is often safer for sending bodies reliable across all clients/proxies
    if (!await validateMethod(req, res, ['POST', 'DELETE'])) {
        return;
    }

    try {
        const { deleteFromDb } = req.body;

        // 1. Delete scanned files
        const resultsDir = path.join(process.cwd(), 'booked-results');
        let deletedFilesCount = 0;

        try {
            if (await fs.access(resultsDir).then(() => true).catch(() => false)) {
                const files = await fs.readdir(resultsDir);
                const bookmarkFiles = files.filter(f => f.startsWith('game_bookmarks_') && f.endsWith('.json'));

                for (const file of bookmarkFiles) {
                    await fs.unlink(path.join(resultsDir, file));
                    deletedFilesCount++;
                }
            }
        } catch (fileError) {
            console.warn('Error deleting files:', fileError);
            // Continue to DB deletion even if file deletion has issues
        }

        // 2. Delete from DB if requested
        let dbDeletedCount = 0;
        if (deleteFromDb) {
            await connectToDatabase();
            const result = await Game.deleteMany({});
            dbDeletedCount = result.deletedCount;
        }

        res.status(200).json({
            message: 'Cleanup successful',
            filesDeleted: deletedFilesCount,
            dbDeleted: dbDeletedCount,
            dbCleared: !!deleteFromDb
        });

    } catch (error: any) {
        await handleApiError(
            res,
            ErrorType.SERVER_ERROR,
            'Failed to delete scan history',
            error.message,
            error
        );
    }
}
