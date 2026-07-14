import { useRouter } from 'expo-router';
import { AppButton } from '../app-button';
import { useAuth0Login } from '../../lib/auth/use-auth0-login';

export function AuthLogoutButton() {
  const router = useRouter();
  const { signOut } = useAuth0Login();
  const handleSignOut = async () => {
    await signOut();
    router.replace('/welcome');
  };

  return (
    <AppButton accessibilityLabel="Sign out" onPress={handleSignOut}>
      Sign out
    </AppButton>
  );
}
