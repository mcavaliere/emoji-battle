import NextAuth, { Session, User } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '../../../lib/prismaClientInstance';

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
    async session({
      session,
      token,
    }): Promise<Session & { user: User & { id?: unknown } }> {
      // expose user id
      return {
        ...session,
        user: { ...session.user, id: token.id as string },
      };
    },
  },
});
