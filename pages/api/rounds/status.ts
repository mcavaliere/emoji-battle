import type { NextApiRequest, NextApiResponse } from 'next';
import dayjs from 'dayjs';

import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prismaClientInstance';
import { EmojiFromListResponsePayload } from '../../../lib/types/EmojiListResponsePayload';
import { Round, Emoji } from '@prisma/client';

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
    // A round is considered in progress if it's been started in the
    //  last 5 minutes and has not been marked as ended.
    const round = await prisma.round.findFirst({
      where: {
        AND: [
          {
            createdAt: {
              gt: dayjs().subtract(5, 'minutes').toDate(),
            },
          },
          {
            endedAt: null,
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

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
