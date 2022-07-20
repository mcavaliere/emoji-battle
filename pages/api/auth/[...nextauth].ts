import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '../../../lib/prismaClientInstance';
import { SessionType } from '../../../lib/types/SessionType';

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  theme: {
    colorScheme: 'auto',
  },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, user }): Promise<SessionType> {
      // expose user id
      return {
        ...session,
        user: { ...session.user, id: user.id },
      };
    },
  },
});
