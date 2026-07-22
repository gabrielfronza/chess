export function formatUsdFromCents(value: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    currency: 'USD',
    style: 'currency',
  }).format(value / 100);
}
