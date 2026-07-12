import { DataSource } from 'typeorm';
import { runSeeds, Seed } from './seed';
import { story002FoundationSeed } from './story-002-foundation.seed';

describe('runSeeds', () => {
  it('runs seeds in the provided order', async () => {
    const calls: string[] = [];
    const dataSource = {} as DataSource;
    const seeds: Seed[] = [
      {
        name: 'first',
        run(receivedDataSource) {
          expect(receivedDataSource).toBe(dataSource);
          calls.push('first');
          return Promise.resolve();
        },
      },
      {
        name: 'second',
        run(receivedDataSource) {
          expect(receivedDataSource).toBe(dataSource);
          calls.push('second');
          return Promise.resolve();
        },
      },
    ];

    const results = await runSeeds(dataSource, seeds);

    expect(calls).toEqual(['first', 'second']);
    expect(results).toEqual([{ name: 'first' }, { name: 'second' }]);
  });

  it('keeps the Story 2 foundation seed intentionally idempotent', async () => {
    const log = jest.spyOn(console, 'log').mockImplementation(() => undefined);

    await expect(
      story002FoundationSeed.run({} as DataSource),
    ).resolves.toBeUndefined();

    expect(story002FoundationSeed.name).toBe('story-002-foundation');
    expect(log).toHaveBeenCalledWith(
      'Story 2 foundation seed has no data changes to apply.',
    );

    log.mockRestore();
  });
});
