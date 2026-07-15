import { fireEvent, render } from '@testing-library/react-native';
import { AuthLoginButton } from './auth-login-button';
import { useAuth0Login } from '../../lib/auth/use-auth0-login';
import { profileApi } from '../../lib/profile-api';

const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

jest.mock('../../lib/auth/use-auth0-login', () => ({
  useAuth0Login: jest.fn(),
}));

jest.mock('../../lib/profile-api', () => ({
  profileApi: {
    getMe: jest.fn(),
  },
}));

describe('AuthLoginButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('starts sign in and navigates home after completed onboarding', async () => {
    const signIn = jest.fn().mockResolvedValue({
      accessToken: 'access-token',
      expiresAt: null,
      idToken: null,
      refreshToken: null,
    });
    (useAuth0Login as jest.Mock).mockReturnValue({ ready: true, signIn });
    (profileApi.getMe as jest.Mock).mockResolvedValue({
      onboardingCompleted: true,
    });
    const { getByRole } = await render(<AuthLoginButton />);

    await fireEvent.press(getByRole('button', { name: 'Sign in' }));

    expect(signIn).toHaveBeenCalled();
    expect(profileApi.getMe).toHaveBeenCalledWith('access-token');
    expect(mockReplace).toHaveBeenCalledWith('/home');
  });

  it('navigates incomplete users to onboarding after login', async () => {
    const signIn = jest.fn().mockResolvedValue({
      accessToken: 'access-token',
      expiresAt: null,
      idToken: null,
      refreshToken: null,
    });
    (useAuth0Login as jest.Mock).mockReturnValue({ ready: true, signIn });
    (profileApi.getMe as jest.Mock).mockResolvedValue({
      onboardingCompleted: false,
    });
    const { getByRole } = await render(<AuthLoginButton />);

    await fireEvent.press(getByRole('button', { name: 'Sign in' }));

    expect(mockReplace).toHaveBeenCalledWith('/onboarding');
  });

  it('stays on the current route when the user cancels login', async () => {
    const signIn = jest.fn().mockResolvedValue(null);
    (useAuth0Login as jest.Mock).mockReturnValue({ ready: true, signIn });
    const { getByRole } = await render(<AuthLoginButton />);

    await fireEvent.press(getByRole('button', { name: 'Sign in' }));

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
