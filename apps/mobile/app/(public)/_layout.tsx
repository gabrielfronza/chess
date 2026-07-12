import { Stack } from 'expo-router/stack';
import { colors } from '../../lib/theme';

export default function PublicLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
      }}
    />
  );
}
