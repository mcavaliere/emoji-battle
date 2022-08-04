import { createContext, useContext } from 'react';
import { Round } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useRoundContextEffectReducer } from './useRoundContextEffectReducer';
import { useRoundContextWebsocketEvents } from './useRoundContextWebsocketEvents';
import { useRoundActionCreators } from './useRoundActionCreators';
import * as Constants from '../../constants';
import { ResponsePayload as StatusResponsePayload } from '../../../pages/api/rounds/status';
import { status as fetchRoundStatus } from '../../api/rounds';

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

export const defaultRoundContext: RoundContextType = {
  inProgress: false,
  currentStep: 0,
  round: undefined,
  roundSummaryVisible: false,
};

export const RoundContext =
  createContext<RoundContextType>(defaultRoundContext);

RoundContext.displayName = 'RoundContext';

export const useRoundContext = () => {
  return useContext(RoundContext);
};

export const RoundProvider = ({ children }) => {
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
          actionCreators.hydrateRound(data.round);
        }
      },
    }
  );

  const [state, dispatch] = useRoundContextEffectReducer();
  useRoundContextWebsocketEvents(dispatch);
  const actionCreators = useRoundActionCreators(state, dispatch);

  return (
    <RoundContext.Provider
      value={{
        ...state!,
        ...actionCreators,
      }}
    >
      {children}
    </RoundContext.Provider>
  );
};
