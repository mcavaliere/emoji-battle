import * as Ably from 'ably';

export let ably;
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

export function getWebsocketChannel(
  channelName: string
): Ably.Types.RealtimeChannelPromise {
  return ably?.channels?.get(channelName);
}
