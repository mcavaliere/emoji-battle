import * as Constants from '../../lib/websocketConstants';
import { useWebsocketChannel } from '../hooks/useWebsocketChannel';
import { EmojisActions } from './EmojisActions';

export const useEmojisContextWebsocketEvents = () => {
  const [emojiBoxChannel] = useWebsocketChannel(
    Constants.CHANNELS.EMOJI_BOXES,
    () => {}
  );
  const [voteChannel] = useWebsocketChannel(
    Constants.CHANNELS.VOTE,
    (message) => {}
  );

  return {
    emojiBoxChannel,
    voteChannel,
  };
};
