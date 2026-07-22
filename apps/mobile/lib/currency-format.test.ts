import { formatUsdFromCents } from './currency-format';

describe('currency formatting', () => {
  it('formats cents as USD', () => {
    expect(formatUsdFromCents(1250, 'en-US')).toBe('$12.50');
  });
});
