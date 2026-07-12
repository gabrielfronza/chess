import { StyleSheet } from 'react-native';
import { colors, spacing } from './theme';

export const radii = {
  md: 8,
};

export const globalStyles = StyleSheet.create({
  bodyText: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 22,
  },
  cardSurface: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.md,
  },
  primaryAction: {
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  primaryActionLabel: {
    color: colors.card,
    fontWeight: '700',
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
});
