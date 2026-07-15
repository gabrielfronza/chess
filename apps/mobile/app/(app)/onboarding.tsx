import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  TextInput,
  View,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { AppButton } from '../../components/app-button';
import { AppScreen } from '../../components/app-screen';
import { AppText } from '../../components/app-text';
import { AuthTokenStorage } from '../../lib/auth/auth-token-storage';
import {
  getCountryLabel,
  getCountryOptions,
  normalizeCountryInput,
  type CountryOption,
} from '../../lib/countries';
import { profileApi, type ProfileApi } from '../../lib/profile-api';
import { setCachedProfile } from '../../lib/profile-session-store';
import { globalStyles } from '../../lib/styles';
import { colors, spacing } from '../../lib/theme';

export default function OnboardingScreen() {
  const router = useRouter();
  return (
    <OnboardingProfileForm
      authTokenStorage={new AuthTokenStorage()}
      profileApiClient={profileApi}
      router={router}
    />
  );
}

type OnboardingProfileFormProps = {
  authTokenStorage: Pick<AuthTokenStorage, 'loadValid'>;
  initialValues?: Partial<OnboardingProfileValues>;
  profileApiClient: Pick<ProfileApi, 'updateOnboardingProfile'>;
  router: Pick<ReturnType<typeof useRouter>, 'replace'>;
};

type OnboardingProfileValues = {
  country: string;
  dateOfBirth: string;
  displayName: string;
};

export function OnboardingProfileForm({
  authTokenStorage,
  initialValues,
  profileApiClient,
  router,
}: OnboardingProfileFormProps) {
  const [country, setCountry] = useState(initialValues?.country ?? '');
  const [dateOfBirth, setDateOfBirth] = useState(
    initialValues?.dateOfBirth ?? '',
  );
  const [displayName, setDisplayName] = useState(
    initialValues?.displayName ?? '',
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitProfile = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      const countryCode = normalizeCountryInput(country);

      if (!countryCode) {
        setError('Choose a valid country from the list.');

        return;
      }

      const session = await authTokenStorage.loadValid();

      if (!session) {
        router.replace('/welcome');

        return;
      }

      const updatedProfile = await profileApiClient.updateOnboardingProfile(
        session.accessToken,
        {
          country: countryCode,
          dateOfBirth,
          displayName,
        },
      );
      setCachedProfile(updatedProfile);
      router.replace('/home');
    } catch {
      setError('Check your profile details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppScreen
      description="Authenticated users land here when their required profile is incomplete."
      eyebrow="Onboarding"
      title="Set up your profile"
    >
      <View style={styles.form}>
        <AppText variant="sectionTitle">Required profile</AppText>
        <AppText variant="body">
          Your Auth0 email stays read-only. Add the tournament profile details
          we need before registrations and wallet access.
        </AppText>

        <Field
          label="Display name"
          onChangeText={setDisplayName}
          placeholder="Player One"
          value={displayName}
        />
        <CountryField
          label="Country"
          onChangeText={setCountry}
          onSelect={setCountry}
          placeholder="Brazil"
          value={country}
        />
        <Field
          label="Date of birth"
          onChangeText={setDateOfBirth}
          placeholder="YYYY-MM-DD"
          value={dateOfBirth}
        />

        {error ? (
          <AppText style={styles.error} variant="body">
            {error}
          </AppText>
        ) : null}

        <AppButton
          accessibilityLabel="Complete onboarding"
          onPress={submitProfile}
          style={isSubmitting ? styles.disabledAction : null}
        >
          {isSubmitting ? 'Saving profile' : 'Complete onboarding'}
        </AppButton>
      </View>
    </AppScreen>
  );
}

function CountryField({
  label,
  onChangeText,
  onSelect,
  placeholder,
  value,
}: {
  label: string;
  onChangeText: (value: string) => void;
  onSelect: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  const countryOptions = getCountryOptions(value);
  const normalizedCountry = normalizeCountryInput(value);
  const selectedCountryLabel = normalizedCountry
    ? getCountryLabel(normalizedCountry)
    : null;

  return (
    <View style={styles.field}>
      <AppText variant="sectionTitle">{label}</AppText>
      <TextInput
        accessibilityLabel={label}
        autoCapitalize="words"
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        style={styles.input}
        value={value}
      />

      {selectedCountryLabel ? (
        <AppText style={styles.fieldHint} variant="body">
          Selected: {selectedCountryLabel} ({normalizedCountry})
        </AppText>
      ) : (
        <AppText style={styles.fieldHint} variant="body">
          Search by country name or ISO code.
        </AppText>
      )}

      <View style={styles.countryOptions}>
        {countryOptions.map((countryOption) => (
          <CountryOptionButton
            countryOption={countryOption}
            key={countryOption.code}
            onSelect={onSelect}
          />
        ))}
      </View>
    </View>
  );
}

function CountryOptionButton({
  countryOption,
  onSelect,
}: {
  countryOption: CountryOption;
  onSelect: (value: string) => void;
}) {
  return (
    <Pressable
      accessibilityLabel={`Select ${countryOption.label}`}
      accessibilityRole="button"
      onPress={() => onSelect(countryOption.label)}
      style={styles.countryOption}
    >
      <AppText variant="body">
        {countryOption.label} ({countryOption.code})
      </AppText>
    </Pressable>
  );
}

function Field({
  autoCapitalize = 'sentences',
  label,
  maxLength,
  onChangeText,
  placeholder,
  value,
}: {
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  label: string;
  maxLength?: number;
  onChangeText: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <View style={styles.field}>
      <AppText variant="sectionTitle">{label}</AppText>
      <TextInput
        accessibilityLabel={label}
        autoCapitalize={autoCapitalize}
        maxLength={maxLength}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        style={styles.input}
        value={value}
      />
    </View>
  );
}

const styles = {
  disabledAction: {
    opacity: 0.5,
  } satisfies ViewStyle,
  countryOption: {
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  } satisfies ViewStyle,
  countryOptions: {
    gap: spacing.sm,
  } satisfies ViewStyle,
  error: {
    color: '#9b1c1c',
  } satisfies TextStyle,
  field: {
    gap: spacing.sm,
  } satisfies ViewStyle,
  fieldHint: {
    color: colors.muted,
    fontSize: 14,
  } satisfies TextStyle,
  form: {
    ...globalStyles.cardSurface,
    gap: spacing.md,
  } satisfies ViewStyle,
  input: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    padding: spacing.md,
  } satisfies TextStyle,
};
