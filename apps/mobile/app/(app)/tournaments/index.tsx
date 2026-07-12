import { AppButton } from '../../../components/app-button';
import { AppScreen } from '../../../components/app-screen';
import { EmptyState } from '../../../components/screen-states';

export default function TournamentsScreen() {
  return (
    <AppScreen
      description="Marketplace and tournament listing behavior begins in later stories."
      eyebrow="Tournaments"
      title="Find your next event"
    >
      <EmptyState
        message="No tournaments are loaded in the shell yet."
        title="Tournament list placeholder"
      />
      <AppButton
        accessibilityLabel="Open sample tournament detail"
        align="center"
        href="/tournaments/story-003-preview"
      >
        Open sample detail
      </AppButton>
    </AppScreen>
  );
}
