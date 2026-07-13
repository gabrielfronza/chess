import { Redirect, Tabs } from 'expo-router';
import { LoadingState } from '../../components/screen-states';
import { useStoredAuthSession } from '../../lib/auth/use-stored-auth-session';
import { colors } from '../../lib/theme';

export default function AuthenticatedTabsLayout() {
  const { isAuthenticated, isLoading } = useStoredAuthSession();

  if (isLoading) {
    return (
      <LoadingState
        message="Checking your local session before opening protected screens."
        title="Checking session"
      />
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/welcome" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShadowVisible: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="tournaments" options={{ title: 'Tournaments' }} />
      <Tabs.Screen name="wallet" options={{ title: 'Wallet' }} />
      <Tabs.Screen name="history" options={{ title: 'History' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      <Tabs.Screen
        name="onboarding"
        options={{ href: null, title: 'Onboarding' }}
      />
    </Tabs>
  );
}
