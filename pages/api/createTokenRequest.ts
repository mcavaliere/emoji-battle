import Ably from 'ably/promises';

export default async function handler(req, res) {
  const client = new Ably.Realtime(process.env.ABLY_PRIVATE_KEY as string);
  const tokenRequestData = await client.auth.createTokenRequest({
    clientId: 'emoji-battle',
  });
  res.status(200).json(tokenRequestData);
  res.end();
}
