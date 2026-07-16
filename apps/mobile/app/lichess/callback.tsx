import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { AppScreen } from '../../components/app-screen';
import { ErrorState, LoadingState } from '../../components/screen-states';
import { AuthTokenStorage } from '../../lib/auth/auth-token-storage';
import { HttpError } from '../../lib/http-client';
import { lichessApi, type LichessApi } from '../../lib/lichess-api';

type LichessCallbackParams = {
  code?: string | string[];
  state?: string | string[];
};

type LichessCallbackRouter = Pick<ReturnType<typeof useRouter>, 'replace'>;

type CompleteLichessCallbackOptions = {
  authTokenStorage: Pick<AuthTokenStorage, 'loadValid'>;
  lichessApiClient: Pick<LichessApi, 'completeOAuth'>;
  params: LichessCallbackParams;
  router: LichessCallbackRouter;
  setError: (error: string | null) => void;
};

export default function LichessCallbackScreen() {
  const params = useLocalSearchParams<LichessCallbackParams>();
  const router = useRouter();
  const hasHandledCallback = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hasHandledCallback.current) {
      return;
    }

    hasHandledCallback.current = true;

    completeLichessCallback({
      authTokenStorage: new AuthTokenStorage(),
      lichessApiClient: lichessApi,
      params,
      router,
      setError,
    });
  }, [params, router]);

  return (
    <AppScreen
      description="Finishing the secure account connection with Lichess."
      eyebrow="Lichess"
      title="Connecting Lichess"
    >
      {error ? (
        <ErrorState
          message={error}
          onRetry={() => router.replace('/profile')}
          title="Lichess connection failed"
        />
      ) : (
        <LoadingState
          message="Please wait while we verify your Lichess authorization."
          title="Finishing Lichess connection"
        />
      )}
    </AppScreen>
  );
}

export async function completeLichessCallback({
  authTokenStorage,
  lichessApiClient,
  params,
  router,
  setError,
}: CompleteLichessCallbackOptions): Promise<void> {
  setError(null);

  try {
    const code = getSingleParam(params.code);
    const state = getSingleParam(params.state);

    if (!code || !state) {
      setError('Lichess did not return a complete authorization callback.');

      return;
    }

    const session = await authTokenStorage.loadValid();

    if (!session) {
      router.replace('/welcome');

      return;
    }

    await lichessApiClient.completeOAuth(session.accessToken, {
      code,
      state,
    });
    router.replace('/profile');
  } catch (error) {
    setError(
      error instanceof HttpError
        ? error.message
        : 'Could not connect Lichess. Please try again.',
    );
  }
}

function getSingleParam(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}
