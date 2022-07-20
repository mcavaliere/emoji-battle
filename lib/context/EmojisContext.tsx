import { createContext, useContext, useReducer } from 'react';
import { useEffectReducer } from '../hooks/useEffectReducer';
import * as Constants from '../../lib/websocketConstants';
import { Emoji } from '@prisma/client';
import { ResponsePayload as StatusResponsePayload } from '../../pages/api/rounds/status';
import {
  start as startRound,
  status as fetchRoundStatus,
} from '../../lib/api/rounds';
import { useQuery, useQueryClient } from 'react-query';

export type EmojisContextType = {
  emojis: Emoji[];
  largestEmojiSize: number;
  recordEmojiSize: (size: number) => void;
};

export enum EmojisActions {
  HYDRATE = 'HYDRATE',
  ADD_EMOJI = 'ADD_EMOJI',
  RECORD_EMOJI_SIZE = 'RECORD_EMOJI_SIZE',
}

export const defaultEmojisContext: EmojisContextType = {
  emojis: [] as Emoji[],
  largestEmojiSize: 0,
  recordEmojiSize: () => {},
};

export function emojisReducer(state, action, exec) {
  console.log(`ACTION: ${action.type}`, action);
  switch (action.type) {
    case EmojisActions.HYDRATE:
      return {
        ...state,
        emojis: action.emojis,
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
  //   const queryClient = useQueryClient();
  const {} = useQuery(
    [Constants.QUERY_CACHE_KEYS.CURRENT_ROUND],
    fetchRoundStatus,
    {
      onSuccess: (data: StatusResponsePayload) => {
        if (data?.emojis) {
          hydrateEmojis(data.emojis);
        }
      },
    }
  );

  const [state, dispatch] = useEffectReducer(
    emojisReducer,
    defaultEmojisContext
  );

  const hydrateEmojis = (emojis: Emoji[]) => {
    dispatch({ type: EmojisActions.HYDRATE, emojis });
  };

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
