import { AppScreen } from '../../components/app-screen';
import { AuthLoginButton } from '../../components/auth/auth-login-button';

export default function LoginScreen() {
  return (
    <AppScreen
      description="Create an account or sign in securely."
      eyebrow="Authentication"
      title="Sign in to CheckmateTour"
    >
      <AuthLoginButton />
    </AppScreen>
  );
}
