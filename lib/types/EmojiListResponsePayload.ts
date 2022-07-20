import { Emoji, Vote } from '@prisma/client';

export type EmojiFromListResponsePayload = Emoji & {
  voteCount: number;
};

export type EmojiListResponsePayload = {
  emojis?: EmojiFromListResponsePayload[];
  error?: unknown;
};
