export const PROFILE_UPDATED_EVENT = 'profile-updated';

export function emitProfileUpdated(profile) {
  window.dispatchEvent(new CustomEvent(PROFILE_UPDATED_EVENT, { detail: profile }));
}
