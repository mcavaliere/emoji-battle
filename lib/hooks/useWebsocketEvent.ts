import { useEffect } from 'react';
import * as Ably from 'ably';
import { getWebsocketChannel, ably } from '../../lib/ablyInstance';

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
