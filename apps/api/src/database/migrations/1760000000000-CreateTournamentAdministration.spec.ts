import { QueryRunner } from 'typeorm';
import { CreateTournamentAdministration1760000000000 } from './1760000000000-CreateTournamentAdministration';

describe('CreateTournamentAdministration1760000000000', () => {
  const migration = new CreateTournamentAdministration1760000000000();

  it('creates tournaments, lifecycle constraints, and audit events', async () => {
    const query = jest.fn().mockResolvedValue(undefined);

    await migration.up({ query } as unknown as QueryRunner);

    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('CREATE TABLE "tournaments"'),
    );
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining(
        '"registration_count" integer NOT NULL DEFAULT 0',
      ),
    );
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('CREATE TABLE "tournament_audit_events"'),
    );
  });

  it('drops owned tables in dependency order', async () => {
    const query = jest.fn().mockResolvedValue(undefined);

    await migration.down({ query } as unknown as QueryRunner);

    expect(query).toHaveBeenNthCalledWith(
      1,
      'DROP TABLE "tournament_audit_events"',
    );
    expect(query).toHaveBeenNthCalledWith(2, 'DROP TABLE "tournaments"');
  });
});
