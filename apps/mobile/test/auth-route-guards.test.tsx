import { render } from '@testing-library/react-native';
import { ReactNode } from 'react';
import AuthenticatedTabsLayout from '../app/(app)/_layout';
import PublicLayout from '../app/(public)/_layout';

let mockAuthSessionState = {
  isAuthenticated: false,
  isLoading: false,
  session: null,
};

jest.mock('../lib/auth/use-stored-auth-session', () => ({
  useStoredAuthSession: () => mockAuthSessionState,
}));

jest.mock('expo-router', () => {
  const { Text, View } = jest.requireActual('react-native');
  const Tabs = ({ children }: { children?: ReactNode }) => (
    <View>
      <Text>Authenticated tabs</Text>
      {children}
    </View>
  );
  Tabs.Screen = ({ name }: { name: string }) => <Text>Tab {name}</Text>;

  return {
    Redirect: ({ href }: { href: string }) => <Text>Redirect to {href}</Text>,
    Tabs,
  };
});

jest.mock('expo-router/stack', () => {
  const { Text, View } = jest.requireActual('react-native');
  const Stack = () => (
    <View>
      <Text>Public stack</Text>
    </View>
  );

  return { Stack };
});

jest.mock('../components/screen-states', () => ({
  LoadingState: ({ message, title }: { message: string; title: string }) => {
    const { Text, View } = jest.requireActual('react-native');

    return (
      <View>
        <Text>{title}</Text>
        <Text>{message}</Text>
      </View>
    );
  },
}));

describe('auth route guards', () => {
  beforeEach(() => {
    mockAuthSessionState = {
      isAuthenticated: false,
      isLoading: false,
      session: null,
    };
  });

  it('redirects logged-out users away from authenticated routes', async () => {
    const { getByText } = await render(<AuthenticatedTabsLayout />);

    expect(getByText('Redirect to /welcome')).toBeTruthy();
  });

  it('renders authenticated routes for logged-in users', async () => {
    mockAuthSessionState = {
      isAuthenticated: true,
      isLoading: false,
      session: null,
    };
    const { getByText } = await render(<AuthenticatedTabsLayout />);

    expect(getByText('Authenticated tabs')).toBeTruthy();
    expect(getByText('Tab home')).toBeTruthy();
  });

  it('shows a loading state while authenticated routes check storage', async () => {
    mockAuthSessionState = {
      isAuthenticated: false,
      isLoading: true,
      session: null,
    };
    const { getByText } = await render(<AuthenticatedTabsLayout />);

    expect(getByText('Checking session')).toBeTruthy();
  });

  it('renders public routes for logged-out users', async () => {
    const { getByText } = await render(<PublicLayout />);

    expect(getByText('Public stack')).toBeTruthy();
  });

  it('redirects logged-in users away from public routes', async () => {
    mockAuthSessionState = {
      isAuthenticated: true,
      isLoading: false,
      session: null,
    };
    const { getByText } = await render(<PublicLayout />);

    expect(getByText('Redirect to /home')).toBeTruthy();
  });
});
