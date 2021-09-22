import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { signIn, useSession } from 'next-auth/client';
import { Button, Container, Heading } from '@chakra-ui/react';

import styles from '../styles/Home.module.css';

// @ts-ignore
const Home: NextPage = () => {
  const [session, loading] = useSession();

  if (!session) {
    return <Button onClick={() => signIn()}>Sign in</Button>;
  }

  return (
    <Container>
      <Heading>Next.js + Prisma = Magic</Heading>
      <Heading size='md'>Welcome, {session.user?.name}.</Heading>
    </Container>
  );
};

export default Home;
