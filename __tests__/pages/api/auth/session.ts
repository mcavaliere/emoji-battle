import axios from 'axios';

describe('/api/auth/session', () => {
  it('should do something', async () => {
    const response = await axios.get('/api/auth/session');

    expect(response.data.user.name).toBe('Mike Cavaliere');
  });
});

export {};
