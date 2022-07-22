import * as Constants from '../../lib/websocketConstants';
import { useEffect } from 'react';
import * as Ably from 'ably';

let ably;
const options: Ably.Types.ClientOptions = {
  authUrl: `/api/createTokenRequest`,
};

// Don't connect to Ably in test since it'll burn resources; we'll mock it.
if (process.env.NODE_ENV !== 'test') {
  // Only create the Ably client once, and only on the frontend.
  if (typeof window !== 'undefined') {
    ably = new Ably.Realtime.Promise(options);
  }
}

export type useWebsocketChannelReturnType = [
  channel: Ably.Types.RealtimeChannelPromise,
  ably: typeof Ably.Realtime.Promise
];

export function getWebsocketChannel(
  channelName: string
): Ably.Types.RealtimeChannelPromise {
  return ably?.channels?.get(channelName);
}

/**
 * Run a function when a specific event happens on a specific channel.
 */
export function useWebsocketEvent(
  channelOrChannelName: string | Ably.Types.RealtimeChannelPromise,
  eventName,
  callback: (data: any) => void
) {
  const channel =
    typeof channelOrChannelName == 'string'
      ? getWebsocketChannel(channelOrChannelName)
      : channelOrChannelName;

  const onMount = () => {
    channel.subscribe(eventName, callback);
  };

  const onUnmount = () => {
    channel.unsubscribe(eventName, callback);
  };

  const useEffectHook = () => {
    onMount();
    return () => {
      onUnmount();
    };
  };

  useEffect(useEffectHook, []);

  return [channel, ably];
}

/**
 * Instantiate all channels the application uses; reference them anywhere with this hook.
 */
export function useWebsocketChannels() {
  const emojiBoxChannel = getWebsocketChannel(Constants.CHANNELS.EMOJI_BOXES);
  const voteChannel = getWebsocketChannel(Constants.CHANNELS.VOTE);
  const playersChannel = getWebsocketChannel(Constants.CHANNELS.PLAYERS);
  return { emojiBoxChannel, voteChannel, playersChannel };
}
