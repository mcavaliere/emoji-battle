const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const start = async (): Promise<any> => {
  return await fetch(`${API_BASE_URL}/rounds/start`, {
    method: 'POST',
  });
};
