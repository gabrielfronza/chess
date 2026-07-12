import {
  ActivityIndicator,
  View,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { AppButton } from './app-button';
import { AppText } from './app-text';
import { colors, spacing } from '../lib/theme';

type MessageStateProps = {
  title: string;
  message: string;
};

export function LoadingState({ title, message }: MessageStateProps) {
  return (
    <View
      accessibilityLabel={`${title}. ${message}`}
      accessibilityRole="progressbar"
      style={styles.state}
    >
      <ActivityIndicator color={colors.primary} />
      <AppText style={styles.stateTitle} variant="sectionTitle">
        {title}
      </AppText>
      <AppText style={styles.stateMessage} variant="body">
        {message}
      </AppText>
    </View>
  );
}

export function EmptyState({ title, message }: MessageStateProps) {
  return (
    <View accessibilityRole="summary" style={styles.state}>
      <AppText style={styles.stateTitle} variant="sectionTitle">
        {title}
      </AppText>
      <AppText style={styles.stateMessage} variant="body">
        {message}
      </AppText>
    </View>
  );
}

type ErrorStateProps = MessageStateProps & {
  onRetry?: () => void;
};

export function ErrorState({ title, message, onRetry }: ErrorStateProps) {
  return (
    <View accessibilityRole="alert" style={styles.state}>
      <AppText style={styles.stateTitle} variant="sectionTitle">
        {title}
      </AppText>
      <AppText style={styles.stateMessage} variant="body">
        {message}
      </AppText>
      {onRetry ? <AppButton onPress={onRetry}>Try again</AppButton> : null}
    </View>
  );
}

const styles = {
  state: {
    alignItems: 'center',
    gap: spacing.sm,
    justifyContent: 'center',
    padding: spacing.lg,
  } satisfies ViewStyle,
  stateMessage: {
    textAlign: 'center',
  } satisfies TextStyle,
  stateTitle: {
    textAlign: 'center',
  } satisfies TextStyle,
};
