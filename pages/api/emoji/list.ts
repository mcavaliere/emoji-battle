// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Emoji } from '@prisma/client';
import prisma from '../../../lib/prismaClientInstance';

type Data = {
  emojis?: Emoji[];
  error?: unknown;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
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
  } catch (error) {
    console.log(`error`, error);
    res.status(500).json({ error });
  }
}
