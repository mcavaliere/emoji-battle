import { createContext, useContext, useEffect, useReducer } from 'react';
import { useWebsocketChannel } from '../hooks/useWebsocketChannel';
import * as Constants from '../../lib/websocketConstants';

import { start as postStartRound } from '../../lib/api/rounds';
import { Round } from '@prisma/client';

export type RoundContextType = {
  round?: Round;
  inProgress: boolean;
  endedAt?: Date;
  start?: (round: Round) => void;
  end?: () => void;
  reset?: () => void;
  currentStep: number;
};

export enum RoundActions {
  START = 'START',
  END = 'END',
  RESET = 'RESET',
  STEP = 'STEP',
}

export const defaultRoundContext: RoundContextType = {
  inProgress: false,
  currentStep: 0,
  round: undefined,
};

export function roundReducer(state = defaultRoundContext, action) {
  switch (action.type) {
    case RoundActions.START:
      return {
        ...state,
        round: action.round,
        inProgress: true,
      };
    case RoundActions.END:
      return {
        ...state,
        inProgress: false,
      };
    case RoundActions.STEP:
      return {
        ...state,
        currentStep: action.currentStep,
      };
    case RoundActions.RESET:
      return defaultRoundContext;
    default:
      return state;
  }
}

export const RoundContext =
  createContext<RoundContextType>(defaultRoundContext);

RoundContext.displayName = 'RoundContext';

export const useRoundContext = () => {
  return useContext(RoundContext);
};

export const RoundProvider = ({ children }) => {
  const [state, dispatch] = useReducer(roundReducer, defaultRoundContext);

  const timerChannelMessageCallback = (message) => {
    if (message.name === Constants.EVENTS.TICK) {
      dispatch({ type: RoundActions.STEP, currentStep: message.data.number });
      return;
    }
    if (message.name === Constants.EVENTS.ROUND_ENDED) {
      dispatch({ type: RoundActions.END });
    }
  };

  const [timerChannel] = useWebsocketChannel(
    Constants.CHANNELS.TIMER,
    timerChannelMessageCallback
  );

  useEffect(() => {
    const startRound = async () => {
      // Create round in database.
      const round = await postStartRound();

      // Set started state in context
      start(round);
    };

    if (state.inProgress) {
      startRound();
    }
  }, [state.inProgress]);

  const start = (round: Round) => {
    dispatch({ type: RoundActions.START, round });
  };

  const end = () => {
    dispatch({ type: RoundActions.END });
  };

  const reset = () => {
    dispatch({ type: RoundActions.RESET });
  };

  return (
    <RoundContext.Provider
      value={{
        ...state,
        start,
        end,
        reset,
      }}
    >
      {children}
    </RoundContext.Provider>
  );
};
