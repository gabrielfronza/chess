import { fireEvent, render } from '@testing-library/react-native';
import { EmptyState, ErrorState, LoadingState } from './screen-states';

describe('screen states', () => {
  it('renders an accessible loading state', async () => {
    const { getByLabelText, getByText } = await render(
      <LoadingState message="Loading shell" title="Loading" />,
    );

    expect(getByLabelText('Loading. Loading shell')).toBeTruthy();
    expect(getByText('Loading shell')).toBeTruthy();
  });

  it('renders an empty state', async () => {
    const { getByText } = await render(
      <EmptyState message="Nothing here yet" title="Empty" />,
    );

    expect(getByText('Empty')).toBeTruthy();
    expect(getByText('Nothing here yet')).toBeTruthy();
  });

  it('renders an error state with retry action', async () => {
    const onRetry = jest.fn();
    const { getByRole, getByText } = await render(
      <ErrorState message="Try later" onRetry={onRetry} title="Failed" />,
    );

    fireEvent.press(getByRole('button', { name: 'Try again' }));

    expect(getByText('Failed')).toBeTruthy();
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
