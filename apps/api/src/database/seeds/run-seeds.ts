/* istanbul ignore file -- CLI entrypoint; seed orchestration is tested separately. */
import dataSource from '../data-source';
import { runSeeds } from './seed';
import { story002FoundationSeed } from './story-002-foundation.seed';

const seeds = [story002FoundationSeed];

async function main(): Promise<void> {
  await dataSource.initialize();

  try {
    const results = await runSeeds(dataSource, seeds);
    const seedNames = results.map((result) => result.name).join(', ');

    console.log(
      `Seed runner completed ${results.length} seed(s): ${seedNames}`,
    );
  } finally {
    await dataSource.destroy();
  }
}

void main();
