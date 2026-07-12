import { Stack } from 'expo-router/stack';

export default function TournamentsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Tournaments' }} />
      <Stack.Screen name="[id]" options={{ title: 'Tournament detail' }} />
    </Stack>
  );
}
