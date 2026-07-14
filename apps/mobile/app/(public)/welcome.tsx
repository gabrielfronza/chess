import { AppButton } from '../../components/app-button';
import { AppScreen } from '../../components/app-screen';
import { PlaceholderCard } from '../../components/placeholder-card';

export default function WelcomeScreen() {
  return (
    <AppScreen
      description="Browse chess tournaments, register securely, and track results from one mobile app."
      eyebrow="CheckmateTour"
      title="Tournament play, organized."
    >
      <PlaceholderCard
        body="Auth and authenticated onboarding arrive through protected flows. Public visitors start here."
        title="Public route"
      />
      <AppButton href="/login">Sign in</AppButton>
    </AppScreen>
  );
}
