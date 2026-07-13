import { AppScreen } from '../../components/app-screen';
import { EmptyState } from '../../components/screen-states';

export default function OnboardingScreen() {
  return (
    <AppScreen
      description="Authenticated users land here when their required profile is incomplete."
      eyebrow="Onboarding"
      title="Set up your tournament profile"
    >
      <EmptyState
        message="Profile setup is intentionally a placeholder until Story 5 owns the real flow, including country and post-login routing."
        title="Onboarding placeholder"
      />
    </AppScreen>
  );
}
