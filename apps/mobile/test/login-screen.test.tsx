import { render } from '@testing-library/react-native';
import LoginScreen from '../app/(public)/login';

jest.mock('../components/auth/auth-login-button', () => {
  const { Text } = jest.requireActual('react-native');

  return {
    AuthLoginButton: () => <Text>Sign in</Text>,
  };
});

describe('LoginScreen', () => {
  it('renders login content', async () => {
    const { getByText } = await render(<LoginScreen />);

    expect(getByText('Sign in to CheckmateTour')).toBeTruthy();
    expect(getByText('Sign in')).toBeTruthy();
  });
});
