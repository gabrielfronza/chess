import { useSyncExternalStore } from 'react';
import { type UserProfileResponse } from './profile-api';

let cachedProfile: UserProfileResponse | null | undefined;
const listeners = new Set<() => void>();

export function clearCachedProfile() {
  cachedProfile = undefined;
  emitProfileChange();
}

export function getCachedProfile() {
  return cachedProfile;
}

export function setCachedProfile(profile: UserProfileResponse | null) {
  cachedProfile = profile;
  emitProfileChange();
}

export function useCachedProfile() {
  return useSyncExternalStore(
    subscribeToProfileChanges,
    getCachedProfile,
    getCachedProfile,
  );
}

function subscribeToProfileChanges(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function emitProfileChange() {
  listeners.forEach((listener) => listener());
}
