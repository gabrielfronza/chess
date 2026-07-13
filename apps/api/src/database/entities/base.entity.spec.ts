import { AppBaseEntity } from '.';

class TestEntity extends AppBaseEntity {}

describe('AppBaseEntity', () => {
  it('defines shared entity identity and audit fields', () => {
    const entity = new TestEntity();
    const createdAt = new Date('2026-01-01T00:00:00.000Z');
    const updatedAt = new Date('2026-01-02T00:00:00.000Z');
    const deletedAt = new Date('2026-01-03T00:00:00.000Z');

    entity.id = 'entity-id';
    entity.createdAt = createdAt;
    entity.updatedAt = updatedAt;
    entity.deletedAt = deletedAt;

    expect(entity).toMatchObject({
      id: 'entity-id',
      createdAt,
      updatedAt,
      deletedAt,
    });
  });
});
