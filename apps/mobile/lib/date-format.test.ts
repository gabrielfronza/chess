import { formatDateTime, formatShortDate } from './date-format';

describe('date formatting', () => {
  it('formats API timestamps for concise display', () => {
    expect(formatShortDate('2026-07-15T12:00:00.000Z', 'en-US')).toBe(
      'Jul 15, 2026',
    );
  });

  it('accepts Date values and different locales', () => {
    expect(formatShortDate(new Date('2026-07-15T12:00:00.000Z'), 'pt-BR')).toBe(
      '15 de jul. de 2026',
    );
  });

  it('formats a local date and time', () => {
    expect(
      formatDateTime(new Date('2026-07-15T12:00:00.000Z'), 'en-US'),
    ).toMatch(/Jul 15, 2026/);
  });
});
