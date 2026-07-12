import { useLocalSearchParams } from 'expo-router';
import { AppScreen } from '../../../components/app-screen';
import { LoadingState } from '../../../components/screen-states';

export default function TournamentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <AppScreen
      description={`Deep link target for tournament ${id}. Details are placeholders until tournament stories own real data.`}
      eyebrow="Tournament detail"
      title="Tournament preview"
    >
      <LoadingState
        message="The detail route is wired and ready for future tournament data."
        title="Waiting for tournament service"
      />
    </AppScreen>
  );
}
