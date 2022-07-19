import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prismaClientInstance';
import { Round, User } from '@prisma/client';
import { start as startTimer } from '../../../lib/api/timer';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Round>
) {
  if (req.method !== 'POST') {
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
    const round = await prisma.round.create({
      data: { startedByUserId: user.id },
    });

    await startTimer(round.id);

    return res.status(200).json(round);
  } catch (error) {
    console.log(`error in POST /rounds/start: `, error);
    res.status(500);
    res.end();
    return;
  }
}
