import { AppScreen } from '../../components/app-screen';
import { AuthLogoutButton } from '../../components/auth/auth-logout-button';
import { PlaceholderCard } from '../../components/placeholder-card';

export default function ProfileScreen() {
  return (
    <AppScreen
      description="Authentication and profile management are intentionally deferred to upcoming stories."
      eyebrow="Profile"
      title="Player profile"
    >
      <PlaceholderCard
        body="The profile shell is ready for Auth0 identity, Lichess linking, and player preferences."
        title="Profile placeholder"
      />
      <AuthLogoutButton />
    </AppScreen>
  );
}
