import { render } from '@testing-library/react-native';
import { PropsWithChildren } from 'react';
import WelcomeScreen from '../app/(public)/welcome';

jest.mock('../components/app-screen', () => ({
  AppScreen: (
    props: PropsWithChildren<{
      description?: string;
      eyebrow?: string;
      title: string;
    }>,
  ) => {
    const { Text, View } = jest.requireActual('react-native');

    return (
      <View>
        <Text>{props.eyebrow}</Text>
        <Text>{props.title}</Text>
        <Text>{props.description}</Text>
        {props.children}
      </View>
    );
  },
}));

jest.mock('../components/placeholder-card', () => ({
  PlaceholderCard: ({ body, title }: { body: string; title: string }) => {
    const { Text, View } = jest.requireActual('react-native');

    return (
      <View>
        <Text>{title}</Text>
        <Text>{body}</Text>
      </View>
    );
  },
}));

jest.mock('../components/app-button', () => ({
  AppButton: ({ children }: { children: string }) => {
    const { Text } = jest.requireActual('react-native');

    return <Text>{children}</Text>;
  },
}));

describe('WelcomeScreen', () => {
  it('renders the public landing content', async () => {
    const { getByText } = await render(<WelcomeScreen />);

    expect(getByText('Chess App')).toBeTruthy();
    expect(getByText('Tournament play, organized.')).toBeTruthy();
    expect(getByText('Public route')).toBeTruthy();
    expect(getByText('Preview onboarding')).toBeTruthy();
  });
});
