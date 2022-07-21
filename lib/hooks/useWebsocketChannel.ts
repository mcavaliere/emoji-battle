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

export function useWebsocketChannel(channelName: string, callbackOnMessage) {
  const channel = ably?.channels?.get(channelName);

  const onMount = () => {
    channel.subscribe((msg) => {
      callbackOnMessage(msg);
    });
  };

  const onUnmount = () => {
    channel.unsubscribe();
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
