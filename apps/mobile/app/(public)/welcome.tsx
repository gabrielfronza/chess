import { AppButton } from '../../components/app-button';
import { AppScreen } from '../../components/app-screen';
import { PlaceholderCard } from '../../components/placeholder-card';

export default function WelcomeScreen() {
  return (
    <AppScreen
      description="Browse chess tournaments, register securely, and track results from one mobile app."
      eyebrow="Chess App"
      title="Tournament play, organized."
    >
      <PlaceholderCard
        body="Auth and onboarding arrive in later stories. This shell keeps the public route ready for them."
        title="Public route"
      />
      <AppButton href="/onboarding">Preview onboarding</AppButton>
    </AppScreen>
  );
}
