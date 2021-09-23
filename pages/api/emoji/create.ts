// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { emoj } = req.body;

  // id         Int    @id @default(autoincrement())
  // name       String
  // externalId String @map(name: "external_id")
  // unified    String
  // colons     String
}
