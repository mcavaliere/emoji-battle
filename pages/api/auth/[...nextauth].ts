import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import Adapters from 'next-auth/adapters';

import prisma from '../../../lib/prismaClientInstance';

export default NextAuth({
  adapter: Adapters.Prisma.Adapter({ prisma }),
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
});
