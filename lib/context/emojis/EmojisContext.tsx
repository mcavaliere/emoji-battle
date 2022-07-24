import { createContext, useContext, useEffect } from 'react';
import { BaseEmoji } from 'emoji-mart';
import { Round } from '@prisma/client';

import { SessionUserType } from '../../types/SessionType';
import { EmojiFromListResponsePayload } from '../../types/EmojiListResponsePayload';

export type EmojisContextType = {
  emojis: EmojiFromListResponsePayload[];
  largestEmojiSize: number;
  recordEmojiSize: (size: number) => void;
  emojiClicked: (
    emoji: BaseEmoji,
    user: Partial<SessionUserType>,
    round: Round
  ) => void;
};

export const defaultEmojisContext: EmojisContextType = {
  emojis: [] as EmojiFromListResponsePayload[],
  largestEmojiSize: 0,
  recordEmojiSize: () => {},
  emojiClicked: (emoji: BaseEmoji, user: Partial<SessionUserType>) => {},
};

export const EmojisContext =
  createContext<EmojisContextType>(defaultEmojisContext);

EmojisContext.displayName = 'EmojisContext';

export const useEmojisContext = () => {
  return useContext(EmojisContext);
};
