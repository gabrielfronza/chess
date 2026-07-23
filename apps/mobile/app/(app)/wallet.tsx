import type {
  WalletBalanceResponse,
  WalletEntryResponse,
} from '@checkmatetour/contracts';
import { useCallback, useEffect, useState } from 'react';
import { View, type ViewStyle } from 'react-native';
import { AppButton } from '../../components/app-button';
import { AppScreen } from '../../components/app-screen';
import { AppText } from '../../components/app-text';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '../../components/screen-states';
import { useStoredAuthSession } from '../../lib/auth/use-stored-auth-session';
import { formatUsdFromCents } from '../../lib/currency-format';
import { formatDateTime } from '../../lib/date-format';
import { globalStyles } from '../../lib/styles';
import { spacing } from '../../lib/theme';
import { walletApi, type WalletApi } from '../../lib/wallet-api';

const pageSize = 20;

export default function WalletScreen() {
  return (
    <WalletContent
      authSession={useStoredAuthSession()}
      walletApiClient={walletApi}
    />
  );
}

export function WalletContent({
  authSession,
  walletApiClient,
}: {
  authSession: ReturnType<typeof useStoredAuthSession>;
  walletApiClient: WalletApi;
}) {
  const accessToken = authSession.session?.accessToken;
  const [balance, setBalance] = useState<WalletBalanceResponse | null>(null);
  const [entries, setEntries] = useState<WalletEntryResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const load = useCallback(
    async (nextPage = 1) => {
      if (!accessToken) return;
      setError(null);
      if (nextPage === 1) setIsLoading(true);
      try {
        const [nextBalance, history] = await Promise.all([
          walletApiClient.getBalance(accessToken),
          walletApiClient.getHistory(accessToken, nextPage, pageSize),
        ]);
        setBalance(nextBalance);
        setEntries((current) =>
          nextPage === 1 ? history.items : mergeEntries(current, history.items),
        );
        setPage(history.page);
        setTotalPages(history.totalPages);
      } catch (caught) {
        setError(
          caught instanceof Error ? caught.message : 'Unable to load wallet.',
        );
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken, walletApiClient],
  );

  useEffect(() => {
    if (!accessToken) return;
    let isActive = true;

    Promise.all([
      walletApiClient.getBalance(accessToken),
      walletApiClient.getHistory(accessToken, 1, pageSize),
    ])
      .then(([nextBalance, history]) => {
        if (!isActive) return;
        setBalance(nextBalance);
        setEntries(history.items);
        setPage(history.page);
        setTotalPages(history.totalPages);
      })
      .catch((caught: unknown) => {
        if (isActive) {
          setError(
            caught instanceof Error ? caught.message : 'Unable to load wallet.',
          );
        }
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [accessToken, walletApiClient]);

  return (
    <AppScreen
      description="Review your available funds, reservations, and immutable ledger history."
      eyebrow="Wallet"
      title="Your balance"
    >
      {authSession.isLoading || isLoading ? (
        <LoadingState message="Loading wallet balances." title="Loading" />
      ) : error && !balance ? (
        <ErrorState
          message={error}
          onRetry={() => void load()}
          title="Could not load wallet"
        />
      ) : balance ? (
        <View style={styles.content}>
          <View style={[globalStyles.cardSurface, styles.balance]}>
            <AppText variant="sectionTitle">Available</AppText>
            <AppText variant="hero">
              {formatUsdFromCents(balance.availableBalanceCents)}
            </AppText>
            <AppText variant="body">
              Reserved {formatUsdFromCents(balance.reservedBalanceCents)}
            </AppText>
          </View>
          <AppButton onPress={() => void load()}>Refresh wallet</AppButton>
          <AppText variant="sectionTitle">Transaction history</AppText>
          {entries.length === 0 ? (
            <EmptyState
              message="Your wallet has no transactions yet."
              title="No transactions"
            />
          ) : (
            entries.map((entry) => <WalletEntry key={entry.id} entry={entry} />)
          )}
          {page < totalPages ? (
            <AppButton align="center" onPress={() => void load(page + 1)}>
              Load more
            </AppButton>
          ) : null}
        </View>
      ) : null}
    </AppScreen>
  );
}

function WalletEntry({ entry }: { entry: WalletEntryResponse }) {
  return (
    <View style={[globalStyles.cardSurface, styles.entry]}>
      <AppText variant="sectionTitle">
        {entry.type} · {formatUsdFromCents(entry.amountCents)}
      </AppText>
      <AppText variant="body">{formatDateTime(entry.createdAt)}</AppText>
      <AppText variant="body">
        {entry.reference ?? entry.reason ?? 'No reference'}
      </AppText>
    </View>
  );
}

function mergeEntries(
  current: WalletEntryResponse[],
  incoming: WalletEntryResponse[],
) {
  const byId = new Map(current.map((entry) => [entry.id, entry]));
  incoming.forEach((entry) => byId.set(entry.id, entry));
  return [...byId.values()];
}

const styles = {
  balance: { gap: spacing.sm } satisfies ViewStyle,
  content: { gap: spacing.md } satisfies ViewStyle,
  entry: { gap: spacing.xs } satisfies ViewStyle,
};
