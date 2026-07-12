import { fireEvent, render } from '@testing-library/react-native';
import { ReactNode } from 'react';
import { Text } from 'react-native';
import { AppButton } from './app-button';

const MockText = Text;

jest.mock('expo-router', () => ({
  Link: ({ children }: { children: ReactNode }) => (
    <MockText>{children}</MockText>
  ),
}));

describe('AppButton', () => {
  it('renders link actions', async () => {
    const { getByText } = await render(
      <AppButton href="/welcome">Open welcome</AppButton>,
    );

    expect(getByText('Open welcome')).toBeTruthy();
  });

  it('renders pressable actions', async () => {
    const onPress = jest.fn();
    const { getByRole } = await render(
      <AppButton onPress={onPress}>Try again</AppButton>,
    );

    fireEvent.press(getByRole('button', { name: 'Try again' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
