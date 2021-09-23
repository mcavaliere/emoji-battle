// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Emoji } from '@prisma/client';
import prisma from '../../../lib/prismaClientInstance';

type Data = {
  emojis?: Emoji[];
  error?: unknown;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const emojis = await prisma.emoji.findMany();

    res.status(200).json({ emojis });
  } catch (error) {
    console.log(`error`, error);
    res.status(500).json({ error });
  }
}
