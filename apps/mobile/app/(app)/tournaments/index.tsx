import type { MarketplaceTournamentResponse } from '@checkmatetour/contracts';
import { useCallback, useEffect, useState } from 'react';
import { View, type ViewStyle } from 'react-native';
import { AppButton } from '../../../components/app-button';
import { AppScreen } from '../../../components/app-screen';
import { AppText } from '../../../components/app-text';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '../../../components/screen-states';
import { useStoredAuthSession } from '../../../lib/auth/use-stored-auth-session';
import { formatUsdFromCents } from '../../../lib/currency-format';
import { formatDateTime } from '../../../lib/date-format';
import { globalStyles } from '../../../lib/styles';
import { tournamentApi, type TournamentApi } from '../../../lib/tournament-api';
import { spacing } from '../../../lib/theme';

const pageSize = 20;

export default function TournamentsScreen() {
  return (
    <TournamentsContent
      authSession={useStoredAuthSession()}
      tournamentApiClient={tournamentApi}
    />
  );
}

export function TournamentsContent({
  authSession,
  tournamentApiClient,
}: {
  authSession: ReturnType<typeof useStoredAuthSession>;
  tournamentApiClient: TournamentApi;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tournaments, setTournaments] = useState<
    MarketplaceTournamentResponse[]
  >([]);
  const accessToken = authSession.session?.accessToken;

  const load = useCallback(
    async (nextPage = 1) => {
      if (!accessToken) return;
      if (nextPage === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      try {
        const result = await tournamentApiClient.listTournaments(
          accessToken,
          nextPage,
          pageSize,
        );
        setTournaments((current) =>
          nextPage === 1 ? result.items : mergeUnique(current, result.items),
        );
        setPage(result.page);
        setTotalPages(result.totalPages);
      } catch (caught) {
        setError(
          caught instanceof Error ? caught.message : 'Unable to load events.',
        );
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [accessToken, tournamentApiClient],
  );

  useEffect(() => {
    if (!accessToken) return;
    let isActive = true;

    tournamentApiClient
      .listTournaments(accessToken, 1, pageSize)
      .then((result) => {
        if (!isActive) return;
        setTournaments(result.items);
        setPage(result.page);
        setTotalPages(result.totalPages);
      })
      .catch((caught: unknown) => {
        if (isActive) {
          setError(
            caught instanceof Error ? caught.message : 'Unable to load events.',
          );
        }
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [accessToken, tournamentApiClient]);

  return (
    <AppScreen
      description="Browse published Checkmate Tour events and review every condition."
      eyebrow="Tournaments"
      title="Find your next event"
    >
      {authSession.isLoading || isLoading ? (
        <LoadingState message="Loading published events." title="Loading" />
      ) : error && tournaments.length === 0 ? (
        <ErrorState
          message={error}
          onRetry={() => void load()}
          title="Could not load tournaments"
        />
      ) : tournaments.length === 0 ? (
        <View style={styles.list}>
          <EmptyState
            message="There are no published tournaments right now. Check back later for the next event."
            title="No tournaments available"
          />
          <AppButton align="center" onPress={() => void load()}>
            Refresh tournaments
          </AppButton>
        </View>
      ) : (
        <View style={styles.list}>
          <AppButton align="start" onPress={() => void load()}>
            Refresh tournaments
          </AppButton>
          {tournaments.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
          {page < totalPages ? (
            <AppButton
              align="center"
              disabled={isLoadingMore}
              onPress={() => void load(page + 1)}
            >
              {isLoadingMore ? 'Loading more…' : 'Load more'}
            </AppButton>
          ) : null}
        </View>
      )}
    </AppScreen>
  );
}

function TournamentCard({
  tournament,
}: {
  tournament: MarketplaceTournamentResponse;
}) {
  return (
    <View style={[globalStyles.cardSurface, styles.card]}>
      <AppText variant="sectionTitle">{tournament.name}</AppText>
      <AppText variant="body">
        {tournament.startsAt
          ? formatDateTime(tournament.startsAt)
          : 'Schedule pending'}
      </AppText>
      <AppText variant="body">
        {tournament.timeControl} · {tournament.rounds} rounds
      </AppText>
      <AppText variant="body">
        Entry {formatUsdFromCents(tournament.entryFeeCents)} · Prize{' '}
        {formatUsdFromCents(tournament.prizePoolCents)}
      </AppText>
      <AppText variant="body">
        {tournament.registrationCount} participants ·{' '}
        {formatStatus(tournament.status)}
      </AppText>
      <AppButton
        accessibilityLabel={`View ${tournament.name}`}
        href={`/tournaments/${tournament.id}`}
      >
        View details
      </AppButton>
    </View>
  );
}

function mergeUnique(
  current: MarketplaceTournamentResponse[],
  incoming: MarketplaceTournamentResponse[],
): MarketplaceTournamentResponse[] {
  const byId = new Map(
    current.map((tournament) => [tournament.id, tournament]),
  );
  incoming.forEach((tournament) => byId.set(tournament.id, tournament));
  return [...byId.values()];
}

function formatStatus(status: MarketplaceTournamentResponse['status']): string {
  return status.toLowerCase().replaceAll('_', ' ');
}

const styles = {
  card: { gap: spacing.sm } satisfies ViewStyle,
  list: { gap: spacing.md } satisfies ViewStyle,
};
