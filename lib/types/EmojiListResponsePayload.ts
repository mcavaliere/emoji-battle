import { Emoji } from '@prisma/client';

export type EmojiFromListResponsePayload = Emoji & {
  _count: {
    votes: number;
  };
};

export type EmojiListResponsePayload = {
  emojis?: EmojiFromListResponsePayload[];
  error?: unknown;
};
