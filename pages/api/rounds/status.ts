import type { NextApiRequest, NextApiResponse } from 'next';
import dayjs from 'dayjs';

import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prismaClientInstance';
import { Round } from '@prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Round>
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

    if (round) {
      res.status(200).json(round);
      return;
    }

    return res.status(204).end();
  } catch (error) {
    console.log(`error in GET /rounds/status: `, error);
    res.status(500);
    res.end();
    return;
  }
}
