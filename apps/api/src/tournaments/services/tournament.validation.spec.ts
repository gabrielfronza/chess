import { BadRequestException } from '@nestjs/common';
import {
  validateMarketplacePagination,
  validateCancelTournament,
  validateCreateTournament,
  validateTournamentTransition,
  validateUpdateTournament,
} from './tournament.validation';

describe('tournament validation', () => {
  it('validates and defaults marketplace pagination', () => {
    expect(validateMarketplacePagination({})).toEqual({
      page: 1,
      pageSize: 20,
    });
    expect(
      validateMarketplacePagination({ page: '2', pageSize: '10' }),
    ).toEqual({ page: 2, pageSize: 10 });
    expect(() => validateMarketplacePagination({ pageSize: 51 })).toThrow(
      BadRequestException,
    );
  });
  it('normalizes a valid draft', () => {
    expect(validateCreateTournament({ name: '  Summer Rapid  ' })).toEqual({
      name: 'Summer Rapid',
    });
  });

  it('rejects invalid money and empty updates', () => {
    expect(() =>
      validateCreateTournament({ entryFeeCents: -1, name: 'Rapid' }),
    ).toThrow(BadRequestException);
    expect(() => validateUpdateTournament({})).toThrow(BadRequestException);
  });

  it('accepts only forward transition targets and meaningful reasons', () => {
    expect(validateTournamentTransition({ status: 'RUNNING' })).toBe('RUNNING');
    expect(() => validateTournamentTransition({ status: 'DRAFT' })).toThrow(
      BadRequestException,
    );
    expect(validateCancelTournament({ reason: 'Event postponed' })).toEqual({
      reason: 'Event postponed',
    });
  });
});
