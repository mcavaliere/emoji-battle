import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../lib/prismaClientInstance';
import { EmojiListResponsePayload } from '../../../lib/types/EmojiListResponsePayload';

/**
 * Deprecated endpoint. This data is now returned from /api/rounds/status.ts.
 * @param req
 * @param res
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EmojiListResponsePayload>
) {
  try {
    const emojis = await prisma.emoji.findMany({
      select: {
        id: true,
        name: true,
        native: true,
        _count: {
          select: {
            votes: true,
          },
        },
        votes: true,
      },
      where: {
        votes: {
          some: {
            createdAt: {
              // Show only votes from the last 15 minutes.
              gt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
            },
          },
        },
      },
      orderBy: {
        votes: { _count: 'desc' },
      },
    });

    res.status(200).json({ emojis });
    res.end();
  } catch (error) {
    console.log(`error`, error);
    res.status(500).json({ error });
    res.end();
  }
}
