import { render } from '@testing-library/react-native';
import { AppText } from './app-text';

describe('AppText', () => {
  it('renders text with the default body variant', async () => {
    const { getByText } = await render(<AppText>Readable body</AppText>);

    expect(getByText('Readable body')).toBeTruthy();
  });

  it('renders text with a semantic role and explicit variant', async () => {
    const { getByRole } = await render(
      <AppText accessibilityRole="header" variant="hero">
        Screen heading
      </AppText>,
    );

    expect(getByRole('header', { name: 'Screen heading' })).toBeTruthy();
  });
});
