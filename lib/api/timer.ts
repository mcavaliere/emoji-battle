import { Round } from '@prisma/client';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Start the hearbeat timer for a round, on the Express server.
 * @returns
 */
export async function start(): Promise<Round> {
  const response = await fetch(`${API_BASE_URL}/rounds/start`, {
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    method: 'POST',
    mode: 'cors',
  });

  if (!response.ok) {
    console.warn(`Error starting timer: `, response.statusText);
    throw new Error('Error starting timer.');
  }

  return await response.json();
}
