import { createContext, useContext, useReducer } from 'react';

export type RoundContextType = {
  inProgress: boolean;
  startedAt?: Date;
  endedAt?: Date;
  start?: () => void;
  end?: () => void;
  reset?: () => void;
};

export enum RoundActions {
  START = 'START',
  END = 'END',
  RESET = 'RESET',
}

export const defaultRoundContext: RoundContextType = {
  inProgress: false,
  startedAt: undefined,
  endedAt: undefined,
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

  const start = () => {
    dispatch({ type: RoundActions.START });
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
