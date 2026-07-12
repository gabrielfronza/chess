import { PropsWithChildren } from 'react';
import { ScrollView, View, type TextStyle, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from './app-text';
import { colors, spacing } from '../lib/theme';

type AppScreenProps = PropsWithChildren<{
  title: string;
  eyebrow?: string;
  description?: string;
}>;

export function AppScreen({
  children,
  description,
  eyebrow,
  title,
}: AppScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        {eyebrow ? <AppText variant="eyebrow">{eyebrow}</AppText> : null}
        <AppText accessibilityRole="header" variant="hero">
          {title}
        </AppText>
        {description ? (
          <AppText style={styles.description} variant="body">
            {description}
          </AppText>
        ) : null}
        <View style={styles.body}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  body: {
    marginTop: spacing.lg,
  } satisfies ViewStyle,
  content: {
    flexGrow: 1,
    padding: spacing.lg,
  } satisfies ViewStyle,
  description: {
    marginTop: spacing.sm,
  } satisfies TextStyle,
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  } satisfies ViewStyle,
};
