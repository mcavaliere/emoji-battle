import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prismaClientInstance';
import { User, Vote } from '@prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Vote>
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

  const { user } = session;

  try {
    if (!req.body.emoji || !req.body.roundId) {
      res.status(400).end();
      return;
    }

    const {
      roundId,
      emoji: { id, name, native, shortcodes, unified },
    } = req.body;

    const round = await prisma.round.findUnique({
      where: { id: roundId },
    });

    // Insert the emoji into the database, if it's not already there
    const emoji = await prisma.emoji.upsert({
      create: {
        externalId: id,
        name,
        native,
        shortcodes,
        unified,
      },
      update: {},
      where: {
        unified,
      },
    });

    // Record the vote.
    const vote = await prisma.vote.create({
      data: {
        emoji: {
          connect: {
            id: emoji?.id,
          },
        },
        user: {
          connect: {
            id: (user as User).id,
          },
        },
        round: {
          connect: {
            id: round?.id,
          },
        },
      },
    });

    res.status(200).json(vote);
    res.end();
    return;
  } catch (error) {
    console.error(`error in /api/votes/create: `, error);
    res.status(500);
    res.end();
    return;
  }
}
