import { useEffect, useState } from 'react';
import { View, type TextStyle } from 'react-native';
import { AppScreen } from '../../components/app-screen';
import { AppButton } from '../../components/app-button';
import { AppText } from '../../components/app-text';
import { AuthLogoutButton } from '../../components/auth/auth-logout-button';
import {
  type StoredAuthSessionState,
  useStoredAuthSession,
} from '../../lib/auth/use-stored-auth-session';
import {
  lichessApi,
  type LichessAccountResponse,
  type LichessApi,
} from '../../lib/lichess-api';
import { linkLichessAccount } from '../../lib/lichess-linking';
import { globalStyles } from '../../lib/styles';
import { colors, spacing } from '../../lib/theme';

type ProfileContentProps = {
  authSession: StoredAuthSessionState;
  lichessApiClient?: LichessApi;
  linkAccount?: typeof linkLichessAccount;
};

export default function ProfileScreen() {
  const authSession = useStoredAuthSession();

  return <ProfileContent authSession={authSession} />;
}

export function ProfileContent({
  authSession,
  lichessApiClient = lichessApi,
  linkAccount = linkLichessAccount,
}: ProfileContentProps) {
  const accessToken = authSession.session?.accessToken;
  const hasAccessToken = Boolean(accessToken);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [linkedAccount, setLinkedAccount] = useState<
    LichessAccountResponse | null | undefined
  >();

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    let isActive = true;

    lichessApiClient
      .getLinkedAccount(accessToken)
      .then((account) => {
        if (isActive) {
          setLinkedAccount(account);
        }
      })
      .catch(() => {
        if (isActive) {
          setLinkedAccount(null);
        }
      });

    return () => {
      isActive = false;
    };
  }, [accessToken, lichessApiClient]);

  const handleConnect = async () => {
    if (!accessToken) {
      setError('Sign in again before connecting Lichess.');

      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const account = await linkAccount({
        accessToken,
        apiClient: lichessApiClient,
      });

      if (account) {
        setLinkedAccount(account);
      }
    } catch {
      setError('Could not connect Lichess. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevoke = async () => {
    if (!accessToken) {
      setError('Sign in again before disconnecting Lichess.');

      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await lichessApiClient.revokeLinkedAccount(accessToken);
      setLinkedAccount(null);
    } catch {
      setError('Could not disconnect Lichess. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppScreen
      description="Manage your tournament identity and connected chess accounts."
      eyebrow="Profile"
      title="Player profile"
    >
      <LichessAccountCard
        error={error}
        isLoading={
          authSession.isLoading ||
          (hasAccessToken && linkedAccount === undefined)
        }
        isSubmitting={isSubmitting}
        linkedAccount={hasAccessToken ? (linkedAccount ?? null) : null}
        onConnect={handleConnect}
        onRevoke={handleRevoke}
      />
      <AuthLogoutButton />
    </AppScreen>
  );
}

function LichessAccountCard({
  error,
  isLoading,
  isSubmitting,
  linkedAccount,
  onConnect,
  onRevoke,
}: {
  error: string | null;
  isLoading: boolean;
  isSubmitting: boolean;
  linkedAccount: LichessAccountResponse | null;
  onConnect: () => void;
  onRevoke: () => void;
}) {
  const buttonLabel = isSubmitting ? 'Working...' : 'Connect Lichess';

  return (
    <View accessibilityRole="summary" style={globalStyles.cardSurface}>
      <AppText variant="sectionTitle">Lichess account</AppText>
      {isLoading ? (
        <AppText style={styles.body}>Checking your Lichess link...</AppText>
      ) : linkedAccount ? (
        <>
          <AppText style={styles.body}>
            Connected as {linkedAccount.username}
          </AppText>
          <AppText style={styles.meta}>
            Linked on {formatDate(linkedAccount.linkedAt)}
          </AppText>
          <AppButton accessibilityLabel="Disconnect Lichess" onPress={onRevoke}>
            {isSubmitting ? 'Working...' : 'Disconnect Lichess'}
          </AppButton>
        </>
      ) : (
        <>
          <AppText style={styles.body}>
            Connect Lichess to prove your chess identity before joining events.
          </AppText>
          <AppButton accessibilityLabel="Connect Lichess" onPress={onConnect}>
            {buttonLabel}
          </AppButton>
        </>
      )}
      {error ? <AppText style={styles.error}>{error}</AppText> : null}
    </View>
  );
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

const styles = {
  body: {
    marginTop: spacing.sm,
  } satisfies TextStyle,
  error: {
    color: colors.primaryDark,
    marginTop: spacing.sm,
  } satisfies TextStyle,
  meta: {
    color: colors.muted,
    marginTop: spacing.xs,
  } satisfies TextStyle,
};
