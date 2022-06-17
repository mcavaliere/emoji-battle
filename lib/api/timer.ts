const API_BASE_URL = process.env.API_BASE_URL;

/**
 * Start the hearbeat timer for a round, on the Express server.
 * @returns
 */
export async function start(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/rounds/start`, {
    method: 'POST',
    mode: 'cors',
  });

  if (!response.ok) {
    console.warn(`Error starting timer: `, response.statusText);
    throw new Error('Error starting timer.');
  }

  return Promise.resolve();
}
