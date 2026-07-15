import { render } from '@testing-library/react-native';
import { ReactNode } from 'react';
import { Text } from 'react-native';
import HistoryScreen from '../app/(app)/history';
import HomeScreen from '../app/(app)/home';
import OnboardingScreen from '../app/(app)/onboarding';
import ProfileScreen from '../app/(app)/profile';
import TournamentDetailScreen from '../app/(app)/tournaments/[id]';
import TournamentsScreen from '../app/(app)/tournaments';
import WalletScreen from '../app/(app)/wallet';
import IndexRoute from '../app/index';

const MockText = Text;

jest.mock('expo-router', () => ({
  Link: ({ children }: { children: ReactNode }) => (
    <MockText>{children}</MockText>
  ),
  Redirect: ({ href }: { href: string }) => (
    <MockText>Redirect to {href}</MockText>
  ),
  useLocalSearchParams: () => ({ id: 'story-003-preview' }),
  useRouter: () => ({ replace: jest.fn() }),
}));

jest.mock('../components/app-button', () => {
  const { Text: MockButtonText } = jest.requireActual('react-native');

  return {
    AppButton: ({ children }: { children: string }) => (
      <MockButtonText>{children}</MockButtonText>
    ),
  };
});

jest.mock('../components/auth/auth-logout-button', () => ({
  AuthLogoutButton: () => {
    const { Text: MockLogoutText } = jest.requireActual('react-native');

    return <MockLogoutText>Sign out</MockLogoutText>;
  },
}));

jest.mock('../components/app-screen', () => ({
  AppScreen: ({
    children,
    description,
    eyebrow,
    title,
  }: {
    children?: ReactNode;
    description?: string;
    eyebrow?: string;
    title: string;
  }) => {
    const { Text: MockScreenText, View: MockScreenView } =
      jest.requireActual('react-native');

    return (
      <MockScreenView>
        <MockScreenText>{eyebrow}</MockScreenText>
        <MockScreenText>{title}</MockScreenText>
        <MockScreenText>{description}</MockScreenText>
        {children}
      </MockScreenView>
    );
  },
}));

jest.mock('../components/placeholder-card', () => ({
  PlaceholderCard: ({ body, title }: { body: string; title: string }) => {
    const { Text: MockCardText, View: MockCardView } =
      jest.requireActual('react-native');

    return (
      <MockCardView>
        <MockCardText>{title}</MockCardText>
        <MockCardText>{body}</MockCardText>
      </MockCardView>
    );
  },
}));

jest.mock('../components/screen-states', () => ({
  EmptyState: ({ message, title }: { message: string; title: string }) => {
    const { Text: MockStateText, View: MockStateView } =
      jest.requireActual('react-native');

    return (
      <MockStateView>
        <MockStateText>{title}</MockStateText>
        <MockStateText>{message}</MockStateText>
      </MockStateView>
    );
  },
  LoadingState: ({ message, title }: { message: string; title: string }) => {
    const { Text: MockStateText, View: MockStateView } =
      jest.requireActual('react-native');

    return (
      <MockStateView>
        <MockStateText>{title}</MockStateText>
        <MockStateText>{message}</MockStateText>
      </MockStateView>
    );
  },
}));

describe('mobile navigation shell', () => {
  it('starts at the public welcome route', async () => {
    const { getByText } = await render(<IndexRoute />);

    expect(getByText('Redirect to /welcome')).toBeTruthy();
  });

  it('renders the onboarding route', async () => {
    const { getByText } = await render(<OnboardingScreen />);

    expect(getByText('Set up your profile')).toBeTruthy();
  });

  it('renders the home tab placeholder', async () => {
    expect(
      (await render(<HomeScreen />)).getByText('Your chess dashboard'),
    ).toBeTruthy();
  });

  it('renders the tournaments tab placeholder', async () => {
    expect(
      (await render(<TournamentsScreen />)).getByText('Find your next event'),
    ).toBeTruthy();
  });

  it('renders the wallet tab placeholder', async () => {
    expect(
      (await render(<WalletScreen />)).getByText('Your balance'),
    ).toBeTruthy();
  });

  it('renders the history tab placeholder', async () => {
    expect(
      (await render(<HistoryScreen />)).getByText('Activity history'),
    ).toBeTruthy();
  });

  it('renders the profile tab placeholder', async () => {
    expect(
      (await render(<ProfileScreen />)).getByText('Player profile'),
    ).toBeTruthy();
  });

  it('renders the tournament deep-link route', async () => {
    const { getByText } = await render(<TournamentDetailScreen />);

    expect(getByText('Tournament preview')).toBeTruthy();
    expect(
      getByText(
        'Deep link target for tournament story-003-preview. Details are placeholders until tournament stories own real data.',
      ),
    ).toBeTruthy();
  });
});
