import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prismaClientInstance';
import { Round } from '@prisma/client';

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

  const { id } = req.query;

  try {
    const round = await prisma.round.findUnique({ id });

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
  } catch (error) {
    console.log(`error in POST /rounds/stop: `, error);
    res.status(500);
    res.end();
    return;
  }
}
