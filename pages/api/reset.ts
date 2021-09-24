import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prismaClientInstance';
import { getSession } from 'next-auth/client';

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
    await prisma.vote.deleteMany();
    await prisma.emoji.deleteMany();
    res.status(200).json({ name: 'John Doe' });
  } catch (e) {
    console.log(`error: `, e);
  }
}
