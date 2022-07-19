import { createContext, useContext, useReducer } from 'react';
import { useEffectReducer } from '../hooks/useEffectReducer';
import { useWebsocketChannel } from '../hooks/useWebsocketChannel';
import * as Constants from '../../lib/websocketConstants';
import { Emoji } from '@prisma/client';

export type EmojisContextType = {
  emojis?: Emoji[];
  largestEmojiSize?: number;
  recordEmojiSize?: (size: number) => void;
};

export enum EmojisActions {
  SET_EMOJIS = 'SET_EMOJIS',
  ADD_EMOJI = 'ADD_EMOJI',
  RECORD_EMOJI_SIZE = 'RECORD_EMOJI_SIZE',
}

export const defaultEmojisContext: EmojisContextType = {
  emojis: [] as Emoji[],
  largestEmojiSize: 0,
  recordEmojiSize: () => {},
};

export function emojisReducer(state, action, exec) {
  switch (action.type) {
    case EmojisActions.SET_EMOJIS:
      return {
        ...state,
      };

    case EmojisActions.ADD_EMOJI:
      return {
        ...state,
      };

    case EmojisActions.RECORD_EMOJI_SIZE:
      return {
        ...state,
      };
  }
}

export const EmojisContext =
  createContext<EmojisContextType>(defaultEmojisContext);

EmojisContext.displayName = 'EmojisContext';

export const useEmojisContext = () => {
  return useContext(EmojisContext);
};

export const EmojisProvider = ({ children }) => {
  const [state, dispatch] = useEffectReducer(
    emojisReducer,
    defaultEmojisContext
  );

  /**
   * Record the size (aka, # votes) anytime a vote happens. This is used to calculate the size of a row.
   * @param size {Number}
   */
  const recordEmojiSize = (size: number) => {
    dispatch({ type: EmojisActions.RECORD_EMOJI_SIZE, size });
  };

  return (
    <EmojisContext.Provider value={{ ...state, recordEmojiSize }}>
      {children}
    </EmojisContext.Provider>
  );
};
