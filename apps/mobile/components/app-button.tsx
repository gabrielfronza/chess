import { Link, type Href } from 'expo-router';
import {
  Pressable,
  type GestureResponderEvent,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { AppText } from './app-text';
import { globalStyles } from '../lib/styles';

type AppButtonAlignment = 'center' | 'start' | 'stretch';

type AppButtonProps = {
  accessibilityLabel?: string;
  align?: AppButtonAlignment;
  children: string;
  disabled?: boolean;
  href?: Href;
  onPress?: (event: GestureResponderEvent) => void;
  style?: StyleProp<TextStyle | ViewStyle>;
};

const alignmentStyles = {
  center: { alignSelf: 'center' },
  start: { alignSelf: 'flex-start' },
  stretch: { alignSelf: 'stretch' },
} satisfies Record<AppButtonAlignment, ViewStyle>;

export function AppButton({
  accessibilityLabel,
  align = 'start',
  children,
  disabled = false,
  href,
  onPress,
  style,
}: AppButtonProps) {
  const actionStyle = [
    globalStyles.primaryAction,
    alignmentStyles[align],
    style,
    disabled ? { opacity: 0.5 } : null,
  ];
  const label = <AppText variant="actionLabel">{children}</AppText>;

  if (href && !disabled) {
    return (
      <Link
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="link"
        href={href}
        style={actionStyle as StyleProp<TextStyle>}
      >
        {label}
      </Link>
    );
  }

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={actionStyle as StyleProp<ViewStyle>}
    >
      {label}
    </Pressable>
  );
}
