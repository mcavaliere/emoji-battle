import { createContext, useContext, useEffect } from 'react';
import { Round, User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useQuery } from 'react-query';
import { useRoundContextEffectReducer } from './useRoundContextEffectReducer';
import { useRoundContextWebsocketEvents } from './useRoundContextWebsocketEvents';
import { useRoundActionCreators } from './useRoundActionCreators';
import { useWebsocketChannels } from '../../hooks/useWebsocketChannels';
import * as Constants from '../../constants';
import { ResponsePayload as StatusResponsePayload } from '../../../pages/api/rounds/status';
import {
  status as fetchRoundStatus,
  users as fetchRoundUsers,
} from '../../api/rounds';

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
  users: User[];
};

export const defaultRoundContext: RoundContextType = {
  inProgress: false,
  currentStep: 0,
  round: undefined,
  roundSummaryVisible: false,
  users: [],
};

export const RoundContext =
  createContext<RoundContextType>(defaultRoundContext);

RoundContext.displayName = 'RoundContext';

export const useRoundContext = () => {
  return useContext(RoundContext);
};

export const RoundProvider = ({ children }) => {
  const { data: session } = useSession();
  const [state, dispatch] = useRoundContextEffectReducer();
  useRoundContextWebsocketEvents(dispatch);
  const actionCreators = useRoundActionCreators(state, dispatch);
  const { playersChannel } = useWebsocketChannels();

  useEffect((): void => {
    if (session?.user) {
      // TODO: lift this up into context side effect.
      playersChannel.publish(Constants.EVENTS.PLAYER_JOINED, session.user);
    }
  }, [session?.user, state?.inProgress]);

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

  // Similarly, populate the list of users in the round.
  const {} = useQuery(
    [Constants.QUERY_CACHE_KEYS.ROUND_USERS],
    () => fetchRoundUsers(state!.round!.id!),
    {
      enabled: !!state?.round?.id,
      onSuccess: (users: User[]) => {
        if (users) {
          actionCreators.hydrateUsers(users);
        }
      },
    }
  );

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
