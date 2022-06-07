import { Round } from '@prisma/client';
import { start as startTimer } from '../../lib/api/timer';

/**
 * Create a Round in the database, then kick off the timer API.
 */
export async function start(): Promise<Round> {
  const response = await fetch(`/api/rounds/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
  });

  if (!response.ok) {
    console.warn(`Error creating round: `, response.statusText);
    throw new Error('Error creating round.');
  }

  await startTimer();

  return await response.json();
}
