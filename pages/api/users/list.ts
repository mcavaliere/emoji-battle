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
      distinct: ['id'],
      where: {
        sessions: {
          some: {
            expires: {
              // Show only users whose session expires in the future.
              gt: new Date(Date.now()).toISOString(),
            },
          },
        },
      },
    });

    res.status(200).json({ users });
  } catch (error) {
    console.log(`error`, error);
    res.status(500).json({ error });
  }
}
