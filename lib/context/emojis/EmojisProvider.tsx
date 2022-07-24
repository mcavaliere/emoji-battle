import * as Constants from '../../constants';
import { ResponsePayload as StatusResponsePayload } from '../../../pages/api/rounds/status';
import { status as fetchRoundStatus } from '../../api/rounds';
import { useQuery } from 'react-query';
import { useEmojisActionCreators } from './useEmojisActionCreators';
import { useEmojisContextReducer } from './useEmojisReducer';
import { useWebsocketChannels } from '../../hooks/useWebsocketChannels';
import { useWebsocketEvent } from '../../hooks/useWebsocketEvent';
import { EmojisContext } from './EmojisContext';

export const EmojisProvider = ({ children }) => {
  const {} = useQuery(
    [Constants.QUERY_CACHE_KEYS.CURRENT_ROUND],
    fetchRoundStatus,
    {
      onSuccess: (data: StatusResponsePayload) => {
        if (data?.emojis) {
          actionCreators.hydrateEmojis(data.emojis);
        }
      },
    }
  );

  const [state, dispatch] = useEmojisContextReducer();
  const { voteChannel } = useWebsocketChannels();
  const actionCreators = useEmojisActionCreators(dispatch);

  useWebsocketEvent(voteChannel, Constants.EVENTS.NEW_VOTE, (message) => {
    // When a new vote is received, update the emoji list in the context.
    const { emoji, user, round } = message.data;
    actionCreators.newVote(emoji, user, round);
  });

  return (
    <EmojisContext.Provider value={{ ...state, ...actionCreators }}>
      {children}
    </EmojisContext.Provider>
  );
};
