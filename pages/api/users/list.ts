// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@prisma/client';
import prisma from '../../../lib/prismaClientInstance';

type Data = {
  users?: User[];
  error?: unknown;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const users = await prisma.user.findMany({
      where: {
        votes: {
          some: {
            createdAt: {
              // Show only users who voted in the last 15 minutes.
              gt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
            },
          },
        },
      },
      include: {
        votes: true,
      },
    });

    res.status(200).json({ users });
  } catch (error) {
    console.log(`error`, error);
    res.status(500).json({ error });
  }
}
