import { createContext, useContext, useEffect, useReducer } from 'react';

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
        currentStep: state.currentStep! + 1,
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

  useEffect(() => {
    if (state.timerStarted && state.currentStep < TIMER_MAX_STEP) {
      setTimeout(tickTimer, 1000);
    } else if (state.currentStep >= state.currentStep) {
      dispatch({ type: RoundActions.STOP_TIMER });
    }
  }, [state.timerStarted, state.currentStep]);

  const tickTimer = () => {
    dispatch({ type: RoundActions.STEP });
  };

  const start = () => {
    dispatch({ type: RoundActions.START });
    dispatch({ type: RoundActions.START_TIMER });
    tickTimer();
  };

  const end = () => {
    dispatch({ type: RoundActions.STOP_TIMER });
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
