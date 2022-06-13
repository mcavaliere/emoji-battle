import { createContext, useContext, useReducer } from 'react';
import { useEffectReducer } from '../hooks/useEffectReducer';
import { useWebsocketChannel } from '../hooks/useWebsocketChannel';
import * as Constants from '../../lib/websocketConstants';

import { start as startRound } from '../../lib/api/rounds';
import { Round } from '@prisma/client';

export type RoundContextType = {
  round?: Round;
  previousRound?: Round;
  inProgress: boolean;
  endedAt?: Date;
  start?: () => void;
  end?: () => void;
  reset?: () => void;
  showRoundSummary?: () => void;
  hideRoundSummary?: () => void;
  currentStep: number;
  roundSummaryVisible: boolean;
};

export enum RoundActions {
  START = 'START',
  END = 'END',
  RESET = 'RESET',
  STEP = 'STEP',
  SHOW_ROUND_SUMMARY = 'SHOW_ROUND_SUMMARY',
  HIDE_ROUND_SUMMARY = 'HIDE_ROUND_SUMMARY',
}

export const defaultRoundContext: RoundContextType = {
  inProgress: false,
  currentStep: 0,
  round: undefined,
  roundSummaryVisible: false,
};

export function triggerSummaryModalEffect(_, _effect, dispatch) {
  dispatch({
    type: RoundActions.SHOW_ROUND_SUMMARY,
  });
}

export const effectMap = {
  triggerSummaryModal: triggerSummaryModalEffect,
};

export function roundReducer(
  state: RoundContextType = defaultRoundContext,
  action,
  exec
) {
  console.log(`ACTION: ${action.type}`);
  switch (action.type) {
    case RoundActions.START:
      return {
        ...state,
        round: action.round,
        inProgress: true,
      };
    case RoundActions.END:
      exec({ type: 'triggerSummaryModal' });

      const previousRound = state.round;
      return {
        ...state,
        previousRound,
        round: undefined,
        inProgress: false,
      };
    case RoundActions.STEP:
      return {
        ...state,
        currentStep: action.currentStep,
      };
    case RoundActions.SHOW_ROUND_SUMMARY:
      return {
        ...state,
        roundSummaryVisible: true,
      };
    case RoundActions.HIDE_ROUND_SUMMARY:
      return {
        ...state,
        roundSummaryVisible: false,
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
  const [state, dispatch] = useEffectReducer(
    roundReducer,
    defaultRoundContext,
    effectMap
  );

  const timerChannelMessageCallback = (message) => {
    // When the server sends TICK, dispatch a STEP to the reducer.
    if (message.name === Constants.EVENTS.TICK) {
      dispatch({ type: RoundActions.STEP, currentStep: message.data.number });
      return;
    }

    // Dispatched by node server when timer completes;
    if (message.name === Constants.EVENTS.ROUND_ENDED) {
      dispatch({ type: RoundActions.END });
    }
  };

  const [timerChannel] = useWebsocketChannel(
    Constants.CHANNELS.TIMER,
    timerChannelMessageCallback
  );

  const start = async () => {
    if (state!.inProgress) {
      return;
    }
    const round = await startRound();
    dispatch({ type: RoundActions.START, round });
  };

  const end = () => {
    dispatch({ type: RoundActions.END });
  };

  const reset = () => {
    dispatch({ type: RoundActions.RESET });
  };

  const showRoundSummary = () => {
    dispatch({ type: RoundActions.SHOW_ROUND_SUMMARY });
  };

  const hideRoundSummary = () => {
    dispatch({ type: RoundActions.HIDE_ROUND_SUMMARY });
  };

  return (
    <RoundContext.Provider
      value={{
        ...state!,
        start,
        end,
        reset,
        showRoundSummary,
        hideRoundSummary,
      }}
    >
      {children}
    </RoundContext.Provider>
  );
};
