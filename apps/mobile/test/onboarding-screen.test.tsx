import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { OnboardingProfileForm } from '../app/(app)/onboarding';
import { type ProfileApi } from '../lib/profile-api';
import { colors } from '../lib/theme';

const mockReplace = jest.fn();
const mockLoadValid = jest.fn();
const mockSetCachedProfile = jest.fn();
const mockUpdateOnboardingProfile = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

jest.mock('../lib/profile-session-store', () => ({
  setCachedProfile: (profile: unknown) => mockSetCachedProfile(profile),
}));

jest.mock('../components/app-button', () => {
  const { Text } = jest.requireActual('react-native');

  return {
    AppButton: ({
      accessibilityLabel,
      children,
      onPress,
    }: {
      accessibilityLabel?: string;
      children: string;
      onPress: () => void;
    }) => (
      <Text
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        onPress={onPress}
      >
        <Text>{children}</Text>
      </Text>
    ),
  };
});

const profileApiClient: Pick<ProfileApi, 'updateOnboardingProfile'> = {
  updateOnboardingProfile: mockUpdateOnboardingProfile,
};

type OnboardingProfileInitialValues = {
  country: string;
  dateOfBirth: string;
  displayName: string;
};

function renderOnboardingProfileForm(
  initialValues?: Partial<OnboardingProfileInitialValues>,
) {
  return render(
    <OnboardingProfileForm
      authTokenStorage={{ loadValid: mockLoadValid }}
      initialValues={initialValues}
      profileApiClient={profileApiClient}
      router={{ replace: mockReplace }}
    />,
  );
}

describe('OnboardingScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLoadValid.mockResolvedValue({ accessToken: 'access-token' });
    mockUpdateOnboardingProfile.mockResolvedValue({
      country: 'BR',
      dateOfBirth: '1990-01-02',
      displayName: 'Player One',
      email: 'player@example.com',
      id: 'user-id',
      onboardingCompleted: true,
      roles: ['USER'],
    });
  });

  it('submits onboarding profile details and routes home', async () => {
    const { getByRole } = await renderOnboardingProfileForm({
      country: 'BR',
      dateOfBirth: '1990-01-02',
      displayName: 'Player One',
    });

    await fireEvent.press(getByRole('button', { name: 'Complete onboarding' }));

    await waitFor(() =>
      expect(mockUpdateOnboardingProfile).toHaveBeenCalledWith('access-token', {
        country: 'BR',
        dateOfBirth: '1990-01-02',
        displayName: 'Player One',
      }),
    );
    expect(mockSetCachedProfile).toHaveBeenCalledWith({
      country: 'BR',
      dateOfBirth: '1990-01-02',
      displayName: 'Player One',
      email: 'player@example.com',
      id: 'user-id',
      onboardingCompleted: true,
      roles: ['USER'],
    });
    expect(mockReplace).toHaveBeenCalledWith('/home');
  });

  it('uses muted placeholder styling for empty fields', async () => {
    const { getByLabelText } = await renderOnboardingProfileForm();

    expect(getByLabelText('Display name').props.placeholderTextColor).toBe(
      colors.placeholder,
    );
    expect(getByLabelText('Country').props.placeholderTextColor).toBe(
      colors.placeholder,
    );
    expect(getByLabelText('Date of birth').props.placeholderTextColor).toBe(
      colors.placeholder,
    );
  });

  it('routes back to welcome when there is no valid session', async () => {
    mockLoadValid.mockResolvedValue(null);
    const { getByLabelText, getByRole } = await renderOnboardingProfileForm();

    await fireEvent.changeText(getByLabelText('Country'), 'BR');
    await fireEvent.press(getByRole('button', { name: 'Complete onboarding' }));

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/welcome'));
    expect(mockUpdateOnboardingProfile).not.toHaveBeenCalled();
  });

  it('requires a valid country before submitting', async () => {
    const { getByLabelText, getByRole, getByText } =
      await renderOnboardingProfileForm();

    await fireEvent.changeText(getByLabelText('Country'), 'Atlantis');
    await fireEvent.press(getByRole('button', { name: 'Complete onboarding' }));

    expect(getByText('Choose a valid country from the list.')).toBeTruthy();
    expect(mockLoadValid).not.toHaveBeenCalled();
    expect(mockUpdateOnboardingProfile).not.toHaveBeenCalled();
  });

  it('selects a country suggestion', async () => {
    const { getByLabelText, getByRole } = await renderOnboardingProfileForm();

    await fireEvent.changeText(getByLabelText('Country'), 'bra');
    await fireEvent.press(getByRole('button', { name: 'Select Brazil' }));

    await waitFor(() =>
      expect(getByLabelText('Country').props.value).toBe('Brazil'),
    );
  });
});
