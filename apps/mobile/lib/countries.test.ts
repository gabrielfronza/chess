import {
  getCountryLabel,
  getCountryOptions,
  normalizeCountryInput,
} from './countries';

describe('countries', () => {
  it('normalizes country names and alpha-2 codes', () => {
    expect(normalizeCountryInput('Brazil')).toBe('BR');
    expect(normalizeCountryInput(' br ')).toBe('BR');
  });

  it('rejects unknown countries', () => {
    expect(normalizeCountryInput('Atlantis')).toBeNull();
    expect(normalizeCountryInput('')).toBeNull();
  });

  it('lists countries from the registered locale', () => {
    expect(getCountryOptions('bra')).toContainEqual({
      code: 'BR',
      label: 'Brazil',
    });
    expect(getCountryLabel('BR')).toBe('Brazil');
  });
});
