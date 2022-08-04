import dayjs from 'dayjs';
import { Round } from '@prisma/client';
import prisma from '../prismaClientInstance';

/**
 * Return the in-progress round, or null if there is none.
 *
 * A round is considered in progress if it's been started in the last 5 minutes and has not been marked as ended.
 */
export async function fetchRoundInProgress(): Promise<Round | null> {
  return prisma.round.findFirst({
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
}
