import { render } from '@testing-library/react';
import Home from './index';
import { useSession } from 'next-auth/react';
import * as Hooks from '../lib/hooks/useWebsocketChannel';
import * as Fetcher from '../lib/fetcher';

jest.mock('next-auth/react');
jest.mock('ably');

const fakeAblyChannel = {
  callback: jest.fn(),
  published: [],
  subscribe: function (callback) {
    this.callback = callback;
  },
  publish: function (message: never) {
    this.published.push(message);
    this.callback(message);
  },
};

class AblyStub {
  fakeAblyChannel = fakeAblyChannel;
  connection = { on: function (string) {} };
  channels = {
    get: function (chName) {
      return fakeAblyChannel;
    },
  };
}

const mockSession = {
  expires: '1',
  user: { email: 'a', name: 'Delta', image: 'c' },
};

it('renders homepage unchanged', async () => {
  jest.spyOn(Hooks, 'useWebsocketChannel').mockImplementation(() => {
    return [fakeAblyChannel, AblyStub];
  });

  jest.spyOn(Fetcher, 'fetcher').mockResolvedValueOnce({ users: [] });

  (useSession as jest.Mock).mockReturnValue({
    data: {
      user: {
        name: 'Dave',
        email: 'foo@bar.com',
        expires: 123123123123,
      },
    },
    status: 'authenticated',
  });

  const { container, debug, findByText } = render(<Home />);

  expect(await findByText('Emoji 🤪 ⚔️ 😀 Battle')).toBeVisible();
  expect(await findByText(`Welcome to the Dojo, Dave.`)).toBeVisible();
});
