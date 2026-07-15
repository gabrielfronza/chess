import { useRouter } from 'expo-router';
import { AppButton } from '../app-button';
import { useAuth0Login } from '../../lib/auth/use-auth0-login';
import { profileApi } from '../../lib/profile-api';

export function AuthLoginButton() {
  const router = useRouter();
  const { ready, signIn } = useAuth0Login();
  const handleSignIn = async () => {
    const session = await signIn();

    if (session) {
      const profile = await profileApi.getMe(session.accessToken);

      router.replace(profile.onboardingCompleted ? '/home' : '/onboarding');
    }
  };

  return (
    <AppButton accessibilityLabel="Sign in with Auth0" onPress={handleSignIn}>
      {ready ? 'Sign in with Auth0' : 'Preparing sign in'}
    </AppButton>
  );
}
