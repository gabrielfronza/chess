import { render, waitFor } from '@testing-library/react-native';
import { ReactNode } from 'react';
import AuthenticatedTabsLayout from '../app/(app)/_layout';
import PublicLayout from '../app/(public)/_layout';
import { profileApi } from '../lib/profile-api';
import {
  clearCachedProfile,
  setCachedProfile,
} from '../lib/profile-session-store';

let mockAuthSessionState = {
  isAuthenticated: false,
  isLoading: false,
  session: null as { accessToken: string } | null,
};
let mockTabScreenOptions: Record<string, { tabBarStyle?: unknown }> = {};
let mockPathname = '/home';

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
  Tabs.Screen = ({
    name,
    options,
  }: {
    name: string;
    options?: { tabBarStyle?: unknown };
  }) => {
    mockTabScreenOptions[name] = options ?? {};

    return <Text>Tab {name}</Text>;
  };

  return {
    Redirect: ({ href }: { href: string }) => <Text>Redirect to {href}</Text>,
    Tabs,
    usePathname: () => mockPathname,
  };
});

jest.mock('../lib/profile-api', () => ({
  profileApi: {
    getMe: jest.fn(),
  },
}));

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
    clearCachedProfile();
    mockAuthSessionState = {
      isAuthenticated: false,
      isLoading: false,
      session: null,
    };
    mockPathname = '/home';
    mockTabScreenOptions = {};
    (profileApi.getMe as jest.Mock).mockResolvedValue({
      onboardingCompleted: true,
    });
  });

  it('redirects logged-out users away from authenticated routes', async () => {
    const { getByText } = await render(<AuthenticatedTabsLayout />);

    expect(getByText('Redirect to /welcome')).toBeTruthy();
  });

  it('renders authenticated routes for logged-in users', async () => {
    mockAuthSessionState = {
      isAuthenticated: true,
      isLoading: false,
      session: { accessToken: 'access-token' },
    };
    const { getByText } = await render(<AuthenticatedTabsLayout />);

    await waitFor(() => expect(getByText('Authenticated tabs')).toBeTruthy());
    expect(getByText('Tab home')).toBeTruthy();
    expect(profileApi.getMe).toHaveBeenCalledWith('access-token');
  });

  it('hides bottom tabs while incomplete users are on onboarding', async () => {
    mockPathname = '/onboarding';
    mockAuthSessionState = {
      isAuthenticated: true,
      isLoading: false,
      session: { accessToken: 'access-token' },
    };
    (profileApi.getMe as jest.Mock).mockResolvedValue({
      onboardingCompleted: false,
    });
    const { getByText } = await render(<AuthenticatedTabsLayout />);

    await waitFor(() => expect(getByText('Authenticated tabs')).toBeTruthy());
    expect(mockTabScreenOptions.onboarding?.tabBarStyle).toEqual({
      display: 'none',
    });
  });

  it('redirects incomplete authenticated users to onboarding', async () => {
    mockAuthSessionState = {
      isAuthenticated: true,
      isLoading: false,
      session: { accessToken: 'access-token' },
    };
    (profileApi.getMe as jest.Mock).mockResolvedValue({
      onboardingCompleted: false,
    });
    const { getByText } = await render(<AuthenticatedTabsLayout />);

    await waitFor(() =>
      expect(getByText('Redirect to /onboarding')).toBeTruthy(),
    );
  });

  it('redirects complete users away from onboarding', async () => {
    mockPathname = '/onboarding';
    setCachedProfile({
      country: 'BR',
      dateOfBirth: '1994-12-15',
      displayName: 'Gabriel',
      email: 'gfronzaeng@gmail.com',
      id: 'user-id',
      onboardingCompleted: true,
      roles: ['USER'],
    });
    mockAuthSessionState = {
      isAuthenticated: true,
      isLoading: false,
      session: { accessToken: 'access-token' },
    };
    const { getByText } = await render(<AuthenticatedTabsLayout />);

    await waitFor(() => expect(getByText('Redirect to /home')).toBeTruthy());
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
