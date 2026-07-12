import { AppScreen } from '../../components/app-screen';
import { EmptyState } from '../../components/screen-states';

export default function OnboardingScreen() {
  return (
    <AppScreen
      description="The onboarding flow will collect profile and Lichess details after authentication is introduced."
      eyebrow="Onboarding"
      title="Set up your tournament profile"
    >
      <EmptyState
        message="Profile setup is intentionally a placeholder until Story 5 owns the real flow."
        title="Onboarding placeholder"
      />
    </AppScreen>
  );
}
