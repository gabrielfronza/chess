import { DataSource } from 'typeorm';

export type Seed = {
  name: string;
  run: (dataSource: DataSource) => Promise<void>;
};

export type SeedResult = {
  name: string;
};

export async function runSeeds(
  dataSource: DataSource,
  seeds: Seed[],
): Promise<SeedResult[]> {
  const results: SeedResult[] = [];

  for (const seed of seeds) {
    await seed.run(dataSource);
    results.push({ name: seed.name });
  }

  return results;
}
