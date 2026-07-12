import { render } from '@testing-library/react-native';
import { PlaceholderCard } from './placeholder-card';

describe('PlaceholderCard', () => {
  it('renders placeholder title and body', async () => {
    const { getByText } = await render(
      <PlaceholderCard body="Placeholder body" title="Placeholder title" />,
    );

    expect(getByText('Placeholder title')).toBeTruthy();
    expect(getByText('Placeholder body')).toBeTruthy();
  });
});
