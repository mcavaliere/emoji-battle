import { render } from '@testing-library/react';
import Home from '../../pages/index';
import { useSession } from 'next-auth/react';
import * as Hooks from '../../lib/hooks/useWebsocketChannel';
import * as Fetcher from '../../lib/fetcher';
import { fakeAblyChannel, AblyStub } from '../../testUtils/ablyMocks';
import { validSession } from '../../testUtils/sessions';

jest.mock('next-auth/react');
jest.mock('ably');

describe('HomePage', () => {
  it('renders homepage unchanged', async () => {
    jest.spyOn(Hooks, 'useWebsocketChannel').mockImplementation(() => {
      return [fakeAblyChannel, AblyStub];
    });

    jest.spyOn(Fetcher, 'fetcher').mockResolvedValueOnce({ users: [] });

    (useSession as jest.Mock).mockReturnValue(validSession);

    const { findByText } = render(<Home />);

    expect(await findByText('Emoji 🤪 ⚔️ 😀 Battle')).toBeVisible();
    expect(await findByText(`Welcome to the Dojo, Dave.`)).toBeVisible();
  });
});
