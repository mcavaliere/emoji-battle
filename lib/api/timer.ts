const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Start the hearbeat timer for a round, on the Express server.
 * @returns
 */
export async function start(roundId: number): Promise<void> {
  const response = await fetch(`${NEXT_PUBLIC_API_BASE_URL}/rounds/start`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      roundId,
    }),
  });

  if (!response.ok) {
    console.warn(`Error starting timer: `, response.statusText);
    throw new Error('Error starting timer.');
  }

  return Promise.resolve();
}
