import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../../lib/prismaClientInstance';
import { Round, User, Vote } from '@prisma/client';

export type Data = Round & {
  votes: Vote[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  const session = await getSession({ req });

  if (!session) {
    res.status(401);
    res.end();
    return;
  }

  const user = session.user as User;

  try {
    const roundId = parseInt(req.query.id as string, 10);
    const round = await prisma.round.findUnique({
      where: { id: roundId },
      include: {
        votes: true,
      },
    });

    // get count of votes
    // get all voters with vounts
    // get all emoji with counts

    return res.status(200).json(round!);
  } catch (error) {
    console.log(`error in GET /rounds/:roundId/stats: `, error);
    res.status(500);
    res.end();
    return;
  }
}
