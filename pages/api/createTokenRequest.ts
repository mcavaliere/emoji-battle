import Ably from 'ably/promises';
import * as Sentry from '@sentry/nextjs';

export default async function handler(req, res) {
  try {
    const client = new Ably.Realtime(process.env.ABLY_PRIVATE_KEY as string);
    const tokenRequestData = await client.auth.createTokenRequest({
      clientId: 'emoji-battle',
    });
    res.status(200).json(tokenRequestData);
    res.end();
  } catch (error) {
    console.log(`createTokenRequest error`, error);
    Sentry.captureException(error);
    res.status(500);
    res.end();
  }
}
