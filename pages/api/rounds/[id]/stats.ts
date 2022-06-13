import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../../lib/prismaClientInstance';
import { Round, Emoji, User, Vote } from '@prisma/client';

export type Data = {
  stats: {
    emoji: [number, number][];
    users: [number, number][];
    round: Record<string, any>;
  };
  // votes: Vote[];
  users: User[];
  userMap: Record<number, User>;
  emoji: Emoji[];
  emojiMap: Record<number, Emoji>;
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

    // Prisma does not yet support sorting/filtering by aggregate values (e.g., sort emojis
    //  by count of votes). So we work around this in JS.
    //
    //  See: https://github.com/prisma/prisma/issues/5837
    const votes = await prisma.vote.findMany({
      where: {
        roundId,
      },
    });

    type StatsMapType = {
      users: Record<number, number>;
      emoji: Record<number, number>;
    };

    // Return an object with counts for users and emoji.
    const stats: StatsMapType = votes.reduce(
      (acc, vote) => {
        // Make sure the index for each user/emoji exists.
        if (acc.users[vote.userId] === undefined) {
          acc.users[vote.userId] = 0;
        }
        acc.users[vote.userId] ||= 0;
        acc.emoji[vote.emojiId] ||= 0;

        acc.users[vote.userId]++;
        acc.emoji[vote.emojiId]++;

        return acc;
      },
      {
        users: {},
        emoji: {},
      } as StatsMapType
    );

    // Sort descending by vote count.
    // TODO: this is a lot of excess iteration to work around JS's forcing of keys to strings. Change this to something more efficient.
    const userStats = Object.entries(stats.users)
      .map<[number, number]>(([id, count]) => [parseInt(id, 10), count])
      .sort((a, b) => b[1] - a[1]);

    const emojiStats = Object.entries(stats.emoji)
      .map<[number, number]>(([id, count]) => [parseInt(id, 10), count])
      .sort((a, b) => b[1] - a[1]);

    // Users who played this round.
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: Object.keys(stats.users).map((id) => parseInt(id, 10)),
        },
      },
    });

    const emoji = await prisma.emoji.findMany({
      where: {
        id: {
          in: Object.keys(stats.emoji).map((id) => parseInt(id, 10)),
        },
      },
    });

    // Emoji objects, keyed by id for easy lookup.
    const emojiMap = emoji.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});

    const userMap = users.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});

    return res.status(200).json({
      stats: {
        users: userStats,
        emoji: emojiStats,
        round: {
          votes: votes.length,
        },
      },
      users,
      userMap,
      emoji,
      emojiMap,
    });
  } catch (error) {
    console.log(`error in GET /rounds/:roundId/stats: `, error);
    res.status(500);
    res.end();
    return;
  }
}
