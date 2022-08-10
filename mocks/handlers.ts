import { rest } from 'msw';

export const handlers = [
  rest.get('/api/auth/session', (req, res, ctx) => {
    return res(
      ctx.json({
        user: {
          name: 'Mike Cavaliere',
          email: null,
          image: 'https://avatars.githubusercontent.com/u/147237?v=4',
          id: 1,
        },
        expires: '2022-09-08T19:01:39.880Z',
      })
    );
  }),
];
