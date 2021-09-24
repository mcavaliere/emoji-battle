// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import prisma from '../../../lib/prismaClientInstance';

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const session = await getSession({ req });

  if (!session) {
    return res.status(401);
  }

  const { user } = session;

  try {
    const {
      emoji: { id, name, native, colons, unified },
    } = req.body;

    // Insert the emoji into the database, if it's not already there
    const emoji = await prisma.emoji.upsert({
      create: {
        externalId: id,
        name,
        native,
        colons,
        unified,
      },
      update: {},
      where: {
        unified,
      },
    });

    const vote = await prisma.vote.create({
      data: {
        Emoji: {
          connect: {
            id: emoji.id,
          },
        },
        User: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    res.status(200).json(emoji);
  } catch (error) {
    console.log(`error: `, error);
    res.status(500);
  }
}
