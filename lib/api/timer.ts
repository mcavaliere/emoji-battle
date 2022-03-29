const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const start = async (): Promise<any> =>
  fetch(`${API_BASE_URL}/rounds/start`, {
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    method: 'POST',
    mode: 'cors',
  });
