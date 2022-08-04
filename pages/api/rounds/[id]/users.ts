// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@prisma/client';
import prisma from '../../../../lib/prismaClientInstance';

type Data = User[];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const roundId: number = Number(req.query.id);

  try {
    const users = await prisma.user.findMany({
      distinct: ['id'],
      where: {
        votes: {
          some: {
            round: {
              id: roundId,
            },
          },
        },
      },
    });

    res.status(200).json(users);
    res.end();
  } catch (error) {
    console.log(`error`, error);
    res.status(500).json(error as any);
    res.end();
  }
}
