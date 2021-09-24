// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@prisma/client';
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
    const users = await prisma.user.findMany();

    res.status(200).json({ users });
  } catch (error) {
    console.log(`error`, error);
    res.status(500).json({ error });
  }
}
