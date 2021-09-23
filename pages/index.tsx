import { useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { signIn, useSession } from 'next-auth/client';
import { Button, Container, Heading, HStack } from '@chakra-ui/react';
import 'emoji-mart/css/emoji-mart.css';

import useSWR from 'swr';

import { EmojiGrid } from '../components/EmojiGrid';
import { EmojiPicker } from '../components/EmojiPicker';

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

  return (
    <Container>
      <Heading mb={5} textAlign='center'>
        Emoji Battle
      </Heading>

      {session?.user?.name && (
        <Heading size='md' mb={20} textAlign='center'>
          Welcome to the Dojo, {session?.user?.name}.
        </Heading>
      )}

      <HStack spacing={20}>
        <EmojiPicker afterSelect={mutateEmojiList} />
        {emojiList && <EmojiGrid emojis={emojiList} />}
      </HStack>
    </Container>
  );
};

export default Home;
