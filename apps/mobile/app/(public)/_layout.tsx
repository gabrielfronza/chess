import { Redirect } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { LoadingState } from '../../components/screen-states';
import { useStoredAuthSession } from '../../lib/auth/use-stored-auth-session';
import { colors } from '../../lib/theme';

export default function PublicLayout() {
  const { isAuthenticated, isLoading } = useStoredAuthSession();

  if (isLoading) {
    return (
      <LoadingState
        message="Checking whether you already have a valid session."
        title="Checking session"
      />
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/home" />;
  }

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: colors.background },
        headerShown: false,
        headerShadowVisible: false,
      }}
    />
  );
}
