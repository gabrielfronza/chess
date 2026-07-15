import { Redirect, Tabs, usePathname } from 'expo-router';
import { useEffect } from 'react';
import { LoadingState } from '../../components/screen-states';
import { useStoredAuthSession } from '../../lib/auth/use-stored-auth-session';
import { profileApi } from '../../lib/profile-api';
import {
  clearCachedProfile,
  setCachedProfile,
  useCachedProfile,
} from '../../lib/profile-session-store';
import { colors } from '../../lib/theme';

const hiddenTabBarStyle = { display: 'none' } as const;
const visibleTabBarStyle = undefined;

export default function AuthenticatedTabsLayout() {
  const pathname = usePathname();
  const { isAuthenticated, isLoading, session } = useStoredAuthSession();
  const profile = useCachedProfile();

  useEffect(() => {
    if (!session?.accessToken) {
      clearCachedProfile();

      return;
    }

    let isActive = true;

    profileApi
      .getMe(session.accessToken)
      .then((nextProfile) => {
        if (isActive) {
          setCachedProfile(nextProfile);
        }
      })
      .catch(() => {
        if (isActive) {
          setCachedProfile(null);
        }
      });

    return () => {
      isActive = false;
    };
  }, [session?.accessToken]);

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

  if (profile === undefined) {
    return (
      <LoadingState
        message="Checking whether your profile is ready for protected screens."
        title="Checking profile"
      />
    );
  }

  if (!profile?.onboardingCompleted && pathname !== '/onboarding') {
    return <Redirect href="/onboarding" />;
  }

  if (profile.onboardingCompleted && pathname === '/onboarding') {
    return <Redirect href="/home" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShadowVisible: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: visibleTabBarStyle,
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="tournaments" options={{ title: 'Tournaments' }} />
      <Tabs.Screen name="wallet" options={{ title: 'Wallet' }} />
      <Tabs.Screen name="history" options={{ title: 'History' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      <Tabs.Screen
        name="onboarding"
        options={{
          href: null,
          tabBarStyle: hiddenTabBarStyle,
          title: 'Onboarding',
        }}
      />
    </Tabs>
  );
}
