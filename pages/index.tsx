import { useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { signIn, useSession } from 'next-auth/client';
import { Button, Container, Heading, HStack } from '@chakra-ui/react';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';

const handleEmojiSelect = (emoji) => {
  console.log(`emoji selected:`, emoji);
};

// @ts-ignore
const Home: NextPage = () => {
  const [session, loading] = useSession();
  const [emojiSet, setEmojiSet] = useState<string>('apple');

  if (!session) {
    return <Button onClick={() => signIn()}>Sign in</Button>;
  }

  return (
    <Container>
      <Heading>Next.js + Prisma = Magic</Heading>
      <Heading size='md'>Welcome, {session.user?.name}.</Heading>

      <HStack>
        <Button onClick={() => setEmojiSet('apple')}>Apple</Button>
        <Button onClick={() => setEmojiSet('google')}>Google</Button>
        <Button onClick={() => setEmojiSet('twitter')}>Twitter</Button>
        <Button onClick={() => setEmojiSet('facebook')}>Facebook</Button>
      </HStack>
      <Picker set={emojiSet} onSelect={handleEmojiSelect} />
    </Container>
  );
};

export default Home;
