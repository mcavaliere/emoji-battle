import { Round } from '@prisma/client';

/**
 * Get data for a round in progress.
 */
export async function status(): Promise<Round | undefined> {
  const response = await fetch(`/api/rounds/status`);

  if (response.status !== 200) {
    return undefined;
  }

  return await response.json();
}

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

  return await response.json();
}

export async function fetchStats(roundId: Round['id']) {
  const response = await fetch(`/api/rounds/${roundId}/stats`, {
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
  });

  if (!response.ok) {
    console.warn(`Error fetching round stats: `, response.statusText);
    throw new Error('Error fetching round stats.');
  }

  return await response.json();
}
