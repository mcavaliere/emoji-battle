import { createContext, useContext } from 'react';
import { useEffectReducer } from '../hooks/useEffectReducer';
import { useWebsocketChannel } from '../hooks/useWebsocketChannel';
import * as Constants from '../../lib/websocketConstants';
import { ResponsePayload as StatusResponsePayload } from '../../pages/api/rounds/status';

import {
  start as startRound,
  status as fetchRoundStatus,
} from '../../lib/api/rounds';
import { Round } from '@prisma/client';
import { useQuery, useQueryClient } from 'react-query';

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
  HYDRATE = 'HYDRATE',
  SHOW_ROUND_SUMMARY = 'SHOW_ROUND_SUMMARY',
  HIDE_ROUND_SUMMARY = 'HIDE_ROUND_SUMMARY',
}

export const defaultRoundContext: RoundContextType = {
  inProgress: false,
  currentStep: 0,
  round: undefined,
  roundSummaryVisible: false,
};

export function triggerSummaryModal(_, _effect, dispatch) {
  dispatch({
    type: RoundActions.SHOW_ROUND_SUMMARY,
  });
}

export function roundReducer(
  state: RoundContextType = defaultRoundContext,
  action,
  exec
) {
  console.log(`ACTION: ${action.type}`);
  switch (action.type) {
    case RoundActions.START:
      exec({ type: 'clearRoundQueryCache' });

      return {
        ...state,
        round: action.round,
        inProgress: true,
      };

    case RoundActions.HYDRATE:
      return {
        ...state,
        round: action.round,
        inProgress: action.inProgress,
      };
    case RoundActions.END:
      exec({ type: 'clearRoundQueryCache' });
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
  const queryClient = useQueryClient();

  // We'll invalidate this cache and refresh round metadata when the websocket
  //  tells us that a round has been started elsewhere. That way the current
  //  use will see a round in progress.
  // TODO: move elsewhere, since it affects multiple contexts
  const {} = useQuery(
    [Constants.QUERY_CACHE_KEYS.CURRENT_ROUND],
    fetchRoundStatus,
    {
      onSuccess: (data: StatusResponsePayload) => {
        if (data?.round) {
          hydrateRound(data.round);
        }
      },
    }
  );

  const clearRoundQueryCache = () => {
    queryClient.refetchQueries([Constants.QUERY_CACHE_KEYS.CURRENT_ROUND]);
  };

  const effectMap = {
    triggerSummaryModal,
    clearRoundQueryCache,
  };

  const [state, dispatch] = useEffectReducer(
    roundReducer,
    defaultRoundContext,
    effectMap
  );

  const hydrateRound = (round: Round) => {
    dispatch({ type: RoundActions.HYDRATE, round, inProgress: true });
  };

  const timerChannelMessageCallback = (message) => {
    // When the server sends TICK, dispatch a STEP to the reducer.
    if (message.name === Constants.EVENTS.TICK) {
      dispatch({ type: RoundActions.STEP, currentStep: message.data.number });
      return;
    }

    // Dispatched by the node server when timer starts.
    if (message.name === Constants.EVENTS.ROUND_STARTED) {
      clearRoundQueryCache();
      return;
    }

    // Dispatched by node server when timer completes.
    if (message.name === Constants.EVENTS.ROUND_ENDED) {
      dispatch({ type: RoundActions.END });
      return;
    }
  };

  useWebsocketChannel(Constants.CHANNELS.TIMER, timerChannelMessageCallback);

  const start = async () => {
    if (state!.inProgress) {
      return;
    }
    dispatch({ type: RoundActions.RESET });
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
