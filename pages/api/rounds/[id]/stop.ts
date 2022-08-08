import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prismaClientInstance';
import { Round } from '@prisma/client';
import * as Sentry from '@sentry/nextjs';

type Data = {
  round?: Round;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const id = parseInt(req.query.id as string, 10);

  try {
    const round = await prisma.round.findUnique({ where: { id } });

    if (!round) {
      res.status(404).json({ error: `Round not found with id: ${id}` });
      return;
    }

    const updatedRound = await prisma.round.update({
      where: { id },
      data: {
        endedAt: new Date().toISOString(),
      },
    });

    res.status(200).json({ round: updatedRound });
  } catch (error) {
    console.log(`error in POST /rounds/stop: `, error);
    Sentry.captureException(error);
    res.status(500);
    res.end();
    return;
  }
}
