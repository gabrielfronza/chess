import type { MarketplaceTournamentResponse } from '@checkmatetour/contracts';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { View, type ViewStyle } from 'react-native';
import { AppButton } from '../../../components/app-button';
import { AppScreen } from '../../../components/app-screen';
import { AppText } from '../../../components/app-text';
import { ErrorState, LoadingState } from '../../../components/screen-states';
import { useStoredAuthSession } from '../../../lib/auth/use-stored-auth-session';
import { formatUsdFromCents } from '../../../lib/currency-format';
import { formatDateTime } from '../../../lib/date-format';
import { globalStyles } from '../../../lib/styles';
import { tournamentApi, type TournamentApi } from '../../../lib/tournament-api';
import { spacing } from '../../../lib/theme';

export default function TournamentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <TournamentDetailContent
      authSession={useStoredAuthSession()}
      id={id}
      tournamentApiClient={tournamentApi}
    />
  );
}

export function TournamentDetailContent({
  authSession,
  id,
  tournamentApiClient,
}: {
  authSession: ReturnType<typeof useStoredAuthSession>;
  id: string;
  tournamentApiClient: TournamentApi;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tournament, setTournament] =
    useState<MarketplaceTournamentResponse | null>(null);
  const accessToken = authSession.session?.accessToken;

  const load = useCallback(async () => {
    if (!accessToken) return;
    setIsLoading(true);
    setError(null);

    try {
      setTournament(await tournamentApiClient.getTournament(accessToken, id));
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : 'Unable to load event.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, id, tournamentApiClient]);

  useEffect(() => {
    if (!accessToken) return;
    let isActive = true;

    tournamentApiClient
      .getTournament(accessToken, id)
      .then((result) => {
        if (isActive) setTournament(result);
      })
      .catch((caught: unknown) => {
        if (isActive) {
          setError(
            caught instanceof Error ? caught.message : 'Unable to load event.',
          );
        }
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [accessToken, id, tournamentApiClient]);

  if (authSession.isLoading || isLoading) {
    return (
      <AppScreen eyebrow="Tournament detail" title="Loading tournament">
        <LoadingState message="Loading event conditions." title="Loading" />
      </AppScreen>
    );
  }

  if (error || !tournament) {
    return (
      <AppScreen eyebrow="Tournament detail" title="Tournament unavailable">
        <ErrorState
          message={error ?? 'This tournament could not be found.'}
          onRetry={() => void load()}
          title="Could not load tournament"
        />
      </AppScreen>
    );
  }

  const availability = getRegistrationAvailability(tournament);

  return (
    <AppScreen
      description={tournament.description ?? undefined}
      eyebrow="Tournament detail"
      title={tournament.name}
    >
      <View style={styles.content}>
        <Detail label="Schedule" value={formatDateTime(tournament.startsAt!)} />
        <Detail
          label="Format"
          value={`${tournament.timeControl} · ${tournament.rounds} rounds · ${tournament.durationMinutes} minutes`}
        />
        <Detail
          label="Entry and prize"
          value={`${formatUsdFromCents(tournament.entryFeeCents)} entry · ${formatUsdFromCents(tournament.prizePoolCents)} prize pool`}
        />
        <Detail
          label="Participants"
          value={`${tournament.registrationCount} registered`}
        />
        <Detail label="Rules" value={tournament.rules ?? 'Rules unavailable'} />
        <View style={[globalStyles.cardSurface, styles.action]}>
          <AppText variant="sectionTitle">{availability.title}</AppText>
          <AppText variant="body">{availability.message}</AppText>
          <AppButton disabled align="stretch">
            Registration unavailable
          </AppButton>
        </View>
        <AppButton onPress={() => void load()}>Refresh details</AppButton>
      </View>
    </AppScreen>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detail}>
      <AppText variant="sectionTitle">{label}</AppText>
      <AppText variant="body">{value}</AppText>
    </View>
  );
}

function getRegistrationAvailability(
  tournament: MarketplaceTournamentResponse,
) {
  if (tournament.status === 'PUBLISHED') {
    return {
      message:
        tournament.entryFeeCents > 0
          ? 'Paid registration is not available yet.'
          : 'Registration will be enabled with the registration flow in Story 11.',
      title: 'Registration coming soon',
    };
  }

  const messages = {
    FINISHED: 'This tournament has finished.',
    REGISTRATION_CLOSED: 'Registration for this tournament is closed.',
    RUNNING: 'This tournament is already running.',
  } as const;

  return {
    message: messages[tournament.status as keyof typeof messages],
    title: 'Registration unavailable',
  };
}

const styles = {
  action: { gap: spacing.sm } satisfies ViewStyle,
  content: { gap: spacing.lg } satisfies ViewStyle,
  detail: { gap: spacing.xs } satisfies ViewStyle,
};
