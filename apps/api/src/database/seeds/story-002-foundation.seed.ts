import { Seed } from './seed';

export const story002FoundationSeed: Seed = {
  name: 'story-002-foundation',
  async run() {
    console.log('Story 2 foundation seed has no data changes to apply.');
    return Promise.resolve();
  },
};
