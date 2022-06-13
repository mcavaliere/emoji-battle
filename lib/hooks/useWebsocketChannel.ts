import Ably from 'ably/promises';

import { useEffect } from 'react';

let ably: Ably.Realtime;

// Only create the Ably client once, and only on the frontend.
if (typeof window !== 'undefined') {
  // ably = new Ably.Realtime.Promise({
  //   authUrl: `/api/createTokenRequest`,
  // });
}

export function useWebsocketChannel(channelName, callbackOnMessage) {
  return [{ publish: () => {}, data: { round: 30, users: [], emoji: [] } }];
}
