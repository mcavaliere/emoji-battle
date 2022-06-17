import { Emoji, Vote } from '@prisma/client';

export type EmojiFromListResponsePayload = Pick<
  Emoji,
  'id' | 'name' | 'native'
> & {
  _count: {
    votes: number;
  };
  votes: Vote[];
};

export type EmojiListResponsePayload = {
  emojis?: EmojiFromListResponsePayload[];
  error?: unknown;
};
