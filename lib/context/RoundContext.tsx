import { createContext, useContext, useEffect, useReducer } from 'react';
import { useWebsocketChannel } from '../hooks/useWebsocketChannel';
import * as Constants from '../../lib/websocketConstants';
import { start as startTimer } from '../../lib/api/timer';

export type RoundContextType = {
  inProgress: boolean;
  startedAt?: Date;
  endedAt?: Date;
  start?: () => void;
  end?: () => void;
  reset?: () => void;
  currentStep: number;
  timerStarted: boolean;
};

export enum RoundActions {
  START = 'START',
  END = 'END',
  RESET = 'RESET',
  STEP = 'STEP',
  START_TIMER = 'START_TIMER',
  STOP_TIMER = 'STOP_TIMER',
}

// Duration of a Round.
export const TIMER_MAX_STEP = 10;

export const defaultRoundContext: RoundContextType = {
  inProgress: false,
  startedAt: undefined,
  endedAt: undefined,
  currentStep: -1,
  timerStarted: false,
};

export function roundReducer(state = defaultRoundContext, action) {
  switch (action.type) {
    case RoundActions.START:
      return {
        ...state,
        inProgress: true,
        startedAt: new Date(),
      };
    case RoundActions.END:
      return {
        ...state,
        inProgress: false,
        endedAt: new Date(),
      };
    case RoundActions.STEP:
      return {
        ...state,
        currentStep: action.currentStep,
      };
    case RoundActions.START_TIMER:
      return {
        ...state,
        timerStarted: true,
      };
    case RoundActions.STOP_TIMER:
      return {
        ...state,
        timerStarted: false,
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
      await startTimer();
    };

    if (state.inProgress) {
      startRound();
    }
  }, [state.inProgress]);

  const tickTimer = () => {
    dispatch({ type: RoundActions.STEP });
  };

  const start = () => {
    dispatch({ type: RoundActions.START });
    tickTimer();
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
