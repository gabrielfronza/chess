import { render, waitFor } from '@testing-library/react-native';
import LichessCallbackScreen, {
  completeLichessCallback,
} from '../app/lichess/callback';
import { lichessApi, type LichessApi } from '../lib/lichess-api';
import { HttpError } from '../lib/http-client';

const mockReplace = jest.fn();
let mockParams: { code?: string; state?: string } = {
  code: 'code',
  state: 'state',
};

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => mockParams,
  useRouter: () => ({ replace: mockReplace }),
}));

jest.mock('../lib/auth/auth-token-storage', () => ({
  AuthTokenStorage: jest.fn().mockImplementation(() => ({
    loadValid: jest.fn().mockResolvedValue({ accessToken: 'access-token' }),
  })),
}));

jest.mock('../lib/lichess-api', () => ({
  lichessApi: {
    completeOAuth: jest.fn().mockResolvedValue({ username: 'PlayerOne' }),
  },
}));

function createLichessApi(): Pick<LichessApi, 'completeOAuth'> {
  return {
    completeOAuth: jest.fn().mockResolvedValue({ username: 'PlayerOne' }),
  };
}

describe('LichessCallbackScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = { code: 'code', state: 'state' };
  });

  it('renders the Lichess callback loading state', async () => {
    const { getByText } = await render(<LichessCallbackScreen />);

    expect(getByText('Connecting Lichess')).toBeTruthy();
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/profile'));
  });

  it('does not retry the completion request after an API failure', async () => {
    (lichessApi.completeOAuth as jest.Mock).mockRejectedValueOnce(
      new Error('Unauthorized'),
    );

    const { getByText } = await render(<LichessCallbackScreen />);

    await waitFor(() =>
      expect(
        getByText('Could not connect Lichess. Please try again.'),
      ).toBeTruthy(),
    );
    expect(lichessApi.completeOAuth).toHaveBeenCalledTimes(1);
    expect(mockReplace).not.toHaveBeenCalledWith('/profile');
  });

  it('shows the API conflict message to the user', async () => {
    (lichessApi.completeOAuth as jest.Mock).mockRejectedValueOnce(
      new HttpError(
        409,
        'This Lichess account is already linked to another user',
      ),
    );

    const { getByText } = await render(<LichessCallbackScreen />);

    await waitFor(() =>
      expect(
        getByText('This Lichess account is already linked to another user'),
      ).toBeTruthy(),
    );
    expect(mockReplace).not.toHaveBeenCalledWith('/profile');
  });

  it('completes Lichess OAuth and routes back to profile', async () => {
    const lichessApiClient = createLichessApi();
    const setError = jest.fn();

    await completeLichessCallback({
      authTokenStorage: {
        loadValid: jest.fn().mockResolvedValue({ accessToken: 'access-token' }),
      },
      lichessApiClient,
      params: { code: 'code', state: 'state' },
      router: { replace: mockReplace },
      setError,
    });

    expect(setError).toHaveBeenCalledWith(null);
    expect(lichessApiClient.completeOAuth).toHaveBeenCalledWith(
      'access-token',
      {
        code: 'code',
        state: 'state',
      },
    );
    expect(mockReplace).toHaveBeenCalledWith('/profile');
  });

  it('rejects incomplete callback params', async () => {
    const setError = jest.fn();
    const lichessApiClient = createLichessApi();

    await completeLichessCallback({
      authTokenStorage: {
        loadValid: jest.fn().mockResolvedValue({ accessToken: 'access-token' }),
      },
      lichessApiClient,
      params: { code: 'code' },
      router: { replace: mockReplace },
      setError,
    });

    expect(setError).toHaveBeenLastCalledWith(
      'Lichess did not return a complete authorization callback.',
    );
    expect(lichessApiClient.completeOAuth).not.toHaveBeenCalled();
  });

  it('routes logged-out users to welcome', async () => {
    const lichessApiClient = createLichessApi();

    await completeLichessCallback({
      authTokenStorage: {
        loadValid: jest.fn().mockResolvedValue(null),
      },
      lichessApiClient,
      params: { code: 'code', state: 'state' },
      router: { replace: mockReplace },
      setError: jest.fn(),
    });

    expect(mockReplace).toHaveBeenCalledWith('/welcome');
    expect(lichessApiClient.completeOAuth).not.toHaveBeenCalled();
  });
});
