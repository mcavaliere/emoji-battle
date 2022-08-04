import type { NextApiRequest, NextApiResponse } from 'next';

import { getSession } from 'next-auth/react';
import * as RoundsService from '../../../lib/services/RoundsService';
import prisma from '../../../lib/prismaClientInstance';
import { EmojiFromListResponsePayload } from '../../../lib/types/EmojiListResponsePayload';
import { Round } from '@prisma/client';

export type ResponsePayload = {
  round: Round;
  emojis: EmojiFromListResponsePayload[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponsePayload>
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

  try {
    const round = await RoundsService.fetchRoundInProgress();

    if (!round) {
      return res.status(204).end();
    }

    // Get the current round's emojis, and their votes.
    const emojisFromDb = await prisma.emoji.findMany({
      include: {
        votes: {
          where: {
            roundId: round.id,
          },
        },
      },
      where: {
        votes: {
          some: {
            roundId: round.id,
          },
        },
      },
    });

    // Sort in place descending by vote count.
    const emojis = emojisFromDb.map(({ votes, ...emoji }) => ({
      ...emoji,
      voteCount: votes.length,
    }));

    emojis.sort((a, b) => b.voteCount - a.voteCount);

    return res.status(200).json({ round, emojis });
  } catch (error) {
    console.log(`error in GET /rounds/status: `, error);
    res.status(500);
    res.end();
    return;
  }
}
