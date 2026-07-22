const shortDateFormatters = new Map<string, Intl.DateTimeFormat>();
const dateTimeFormatters = new Map<string, Intl.DateTimeFormat>();

export function formatShortDate(value: Date | string, locale = 'en'): string {
  let formatter = shortDateFormatters.get(locale);

  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    shortDateFormatters.set(locale, formatter);
  }

  return formatter.format(typeof value === 'string' ? new Date(value) : value);
}

export function formatDateTime(value: Date | string, locale = 'en'): string {
  let formatter = dateTimeFormatters.get(locale);

  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
    dateTimeFormatters.set(locale, formatter);
  }

  return formatter.format(typeof value === 'string' ? new Date(value) : value);
}
