import * as Constants from '../../lib/websocketConstants';
import { getWebsocketChannel } from '../../lib/ablyInstance';

/**
 * Instantiate all channels the application uses; reference them anywhere with this hook.
 */
export function useWebsocketChannels() {
  const emojiBoxChannel = getWebsocketChannel(Constants.CHANNELS.EMOJI_BOXES);
  const voteChannel = getWebsocketChannel(Constants.CHANNELS.VOTE);
  const playersChannel = getWebsocketChannel(Constants.CHANNELS.PLAYERS);
  return { emojiBoxChannel, voteChannel, playersChannel };
}
