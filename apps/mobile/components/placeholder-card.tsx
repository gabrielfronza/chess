import { View, type TextStyle } from 'react-native';
import { AppText } from './app-text';
import { globalStyles } from '../lib/styles';
import { spacing } from '../lib/theme';

type PlaceholderCardProps = {
  title: string;
  body: string;
};

export function PlaceholderCard({ body, title }: PlaceholderCardProps) {
  return (
    <View accessibilityRole="summary" style={globalStyles.cardSurface}>
      <AppText variant="sectionTitle">{title}</AppText>
      <AppText style={styles.body} variant="body">
        {body}
      </AppText>
    </View>
  );
}

const styles = {
  body: {
    marginTop: spacing.sm,
  } satisfies TextStyle,
};
