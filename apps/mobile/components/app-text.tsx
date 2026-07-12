import { Text, type TextProps } from 'react-native';
import { globalStyles } from '../lib/styles';

type AppTextVariant =
  'actionLabel' | 'body' | 'eyebrow' | 'hero' | 'sectionTitle';

type AppTextProps = TextProps & {
  variant?: AppTextVariant;
};

const variantStyles = {
  actionLabel: globalStyles.primaryActionLabel,
  body: globalStyles.bodyText,
  eyebrow: globalStyles.eyebrow,
  hero: globalStyles.heroTitle,
  sectionTitle: globalStyles.sectionTitle,
};

export function AppText({
  children,
  style,
  variant = 'body',
  ...props
}: AppTextProps) {
  return (
    <Text {...props} style={[variantStyles[variant], style]}>
      {children}
    </Text>
  );
}
