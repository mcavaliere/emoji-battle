import { useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { signIn, useSession } from 'next-auth/client';
import { Button, Container, Heading, HStack } from '@chakra-ui/react';
import 'emoji-mart/css/emoji-mart.css';
import { Picker, EmojiSet } from 'emoji-mart';
import useSWR from 'swr';

import { EmojiGrid } from '../components/EmojiGrid';

const fetcher = async (...args) => {
  try {
    return fetch(...args).then((res) => res.json());
  } catch (error) {
    console.log(`fetcher error:`, error);
  }
};

// @ts-ignore
const Home: NextPage = () => {
  const [session, loading] = useSession();
  const [emojiSet, setEmojiSet] = useState<EmojiSet>('apple');
  const {
    data: emojiData,
    error: listError,
    mutate: mutateEmojiList,
  } = useSWR(`/api/emoji/list`, fetcher);

  if (listError) return <div>failed to load</div>;
  if (!emojiData?.emojis) return <div>loading...</div>;

  const { emojis: emojiList } = emojiData;

  if (!session) {
    return <Button onClick={() => signIn()}>Sign in</Button>;
  }

  const handleEmojiSelect = async (emoji: any) => {
    await fetch('/api/emoji/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ emoji }),
    });
    mutateEmojiList();
  };

  return (
    <Container>
      <Heading>Next.js + Prisma = Magic</Heading>
      <Heading size='md'>Welcome, {session?.user?.name}.</Heading>

      <HStack>
        <Button onClick={() => setEmojiSet('apple')}>Apple</Button>
        <Button onClick={() => setEmojiSet('google')}>Google</Button>
        <Button onClick={() => setEmojiSet('twitter')}>Twitter</Button>
        <Button onClick={() => setEmojiSet('facebook')}>Facebook</Button>
      </HStack>
      <HStack>
        <Picker set={emojiSet} onSelect={handleEmojiSelect} />
        {emojiList && <EmojiGrid emojis={emojiList} />}
      </HStack>
    </Container>
  );
};

export default Home;
