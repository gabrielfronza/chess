import { ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorState } from '../components/screen-states';
import { colors } from '../lib/theme';

const navigationTheme = {
  dark: false,
  colors: {
    background: colors.background,
    border: colors.border,
    card: colors.card,
    notification: colors.primary,
    primary: colors.primary,
    text: colors.text,
  },
  fonts: {
    bold: { fontFamily: 'System', fontWeight: '700' as const },
    heavy: { fontFamily: 'System', fontWeight: '800' as const },
    medium: { fontFamily: 'System', fontWeight: '500' as const },
    regular: { fontFamily: 'System', fontWeight: '400' as const },
  },
};

export function ErrorBoundary({
  error,
  retry,
}: {
  error: Error;
  retry: () => void;
}) {
  return (
    <ErrorState
      message={error.message}
      onRetry={retry}
      title="Something went wrong"
    />
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider value={navigationTheme}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(public)" />
          <Stack.Screen name="(app)" />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
