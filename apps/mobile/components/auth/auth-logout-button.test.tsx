import { fireEvent, render } from '@testing-library/react-native';
import { AuthLogoutButton } from './auth-logout-button';
import { useAuth0Login } from '../../lib/auth/use-auth0-login';

const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

jest.mock('../../lib/auth/use-auth0-login', () => ({
  useAuth0Login: jest.fn(),
}));

describe('AuthLogoutButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('clears the local Auth0 session and navigates to welcome when pressed', async () => {
    const signOut = jest.fn().mockResolvedValue(undefined);
    (useAuth0Login as jest.Mock).mockReturnValue({ signOut });
    const { getByRole } = await render(<AuthLogoutButton />);

    await fireEvent.press(getByRole('button', { name: 'Sign out' }));

    expect(signOut).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith('/welcome');
  });
});
