import {
  getAlpha2Code,
  getName,
  getNames,
  isValid,
  registerLocale,
  type LocaleData,
} from 'i18n-iso-countries';
import englishLocale from 'i18n-iso-countries/langs/en.json';

registerLocale(englishLocale as LocaleData);

export type CountryOption = {
  code: string;
  label: string;
};

const countryOptions = Object.entries(getNames('en'))
  .map(([code, label]) => ({ code, label }))
  .sort((current, next) => current.label.localeCompare(next.label));

export function getCountryOptions(search = '', limit = 6): CountryOption[] {
  const normalizedSearch = search.trim().toLowerCase();

  if (!normalizedSearch) {
    return countryOptions.slice(0, limit);
  }

  return countryOptions
    .filter(
      ({ code, label }) =>
        code.toLowerCase().startsWith(normalizedSearch) ||
        label.toLowerCase().includes(normalizedSearch),
    )
    .slice(0, limit);
}

export function getCountryLabel(countryCode: string): string | null {
  return getName(countryCode, 'en') ?? null;
}

export function normalizeCountryInput(country: string): string | null {
  const normalizedCountry = country.trim();

  if (!normalizedCountry) {
    return null;
  }

  const upperCountry = normalizedCountry.toUpperCase();

  if (upperCountry.length === 2 && isValid(upperCountry)) {
    return upperCountry;
  }

  return getAlpha2Code(normalizedCountry, 'en') ?? null;
}
