// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
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

  try {
    const {
      emoji: { id, name, native, colons, unified },
    } = req.body;

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

    res.status(200).json(emoji);
  } catch (error) {
    console.log(`error: `, error);
    res.status(500);
  }
}
