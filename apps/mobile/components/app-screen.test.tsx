import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { AppScreen } from './app-screen';

describe('AppScreen', () => {
  it('renders the screen heading and content', async () => {
    const { getByRole, getByText } = await render(
      <AppScreen
        description="Screen description"
        eyebrow="Section"
        title="Screen title"
      >
        <Text>Screen body</Text>
      </AppScreen>,
    );

    expect(getByRole('header', { name: 'Screen title' })).toBeTruthy();
    expect(getByText('Section')).toBeTruthy();
    expect(getByText('Screen description')).toBeTruthy();
    expect(getByText('Screen body')).toBeTruthy();
  });
});
