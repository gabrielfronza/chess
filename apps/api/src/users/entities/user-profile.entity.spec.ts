import { getMetadataArgsStorage } from 'typeorm';
import { UserProfile, User } from '.';

describe('user profile entities', () => {
  it('defines a one-to-one profile relation from users to user profiles', () => {
    const relation = getMetadataArgsStorage().relations.find(
      (metadata) =>
        metadata.target === User && metadata.propertyName === 'profile',
    );

    expect(relation?.type()).toBe(UserProfile);
    expect(relation?.inverseSideProperty?.({ user: 'user-relation' })).toBe(
      'user-relation',
    );
  });

  it('defines user_id as the owning one-to-one relation back to users', () => {
    const relation = getMetadataArgsStorage().relations.find(
      (metadata) =>
        metadata.target === UserProfile && metadata.propertyName === 'user',
    );

    expect(relation?.type()).toBe(User);
    expect(
      relation?.inverseSideProperty?.({ profile: 'profile-relation' }),
    ).toBe('profile-relation');
  });
});
