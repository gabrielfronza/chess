import { AppScreen } from '../../components/app-screen';
import { PlaceholderCard } from '../../components/placeholder-card';

export default function HomeScreen() {
  return (
    <AppScreen
      description="A signed-in home dashboard placeholder for upcoming registration and result stories."
      eyebrow="Home"
      title="Your chess dashboard"
    >
      <PlaceholderCard
        body="Upcoming tournaments, active registrations, and result updates will land here in later stories."
        title="Authenticated tab"
      />
    </AppScreen>
  );
}
