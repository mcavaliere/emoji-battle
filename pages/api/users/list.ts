import type { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@prisma/client';
import dayjs from 'dayjs';
import * as Sentry from '@sentry/nextjs';

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
        votes: {
          some: {
            createdAt: {
              // Show only users who have voted in the last 5 minutes.
              gt: dayjs().subtract(5, 'minutes').toISOString(),
            },
          },
        },
      },
    });

    res.status(200).json({ users });
    res.end();
  } catch (error) {
    console.log(`error`, error);
    Sentry.captureException(error);
    res.status(500).json({ error });
    res.end();
  }
}
