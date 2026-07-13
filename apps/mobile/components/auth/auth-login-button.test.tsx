import { fireEvent, render } from '@testing-library/react-native';
import { AuthLoginButton } from './auth-login-button';
import { useAuth0Login } from '../../lib/auth/use-auth0-login';

const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

jest.mock('../../lib/auth/use-auth0-login', () => ({
  useAuth0Login: jest.fn(),
}));

describe('AuthLoginButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('starts Auth0 Universal Login and navigates home after a saved session', async () => {
    const signIn = jest.fn().mockResolvedValue({
      accessToken: 'access-token',
      expiresAt: null,
      idToken: null,
      refreshToken: null,
    });
    (useAuth0Login as jest.Mock).mockReturnValue({ ready: true, signIn });
    const { getByRole } = await render(<AuthLoginButton />);

    await fireEvent.press(getByRole('button', { name: 'Sign in with Auth0' }));

    expect(signIn).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith('/home');
  });

  it('stays on the current route when the user cancels login', async () => {
    const signIn = jest.fn().mockResolvedValue(null);
    (useAuth0Login as jest.Mock).mockReturnValue({ ready: true, signIn });
    const { getByRole } = await render(<AuthLoginButton />);

    await fireEvent.press(getByRole('button', { name: 'Sign in with Auth0' }));

    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('shows a preparing state until the auth request is ready', async () => {
    (useAuth0Login as jest.Mock).mockReturnValue({
      ready: false,
      signIn: jest.fn(),
    });
    const { getByText } = await render(<AuthLoginButton />);

    expect(getByText('Preparing sign in')).toBeTruthy();
  });
});
