import { useSyncExternalStore } from 'react';
import { getRawAuthToken, subscribeToAuthTokenChanges } from '../../../shared/lib/cookies';

// Uses the raw (non-self-expiring) token read, not getAuthToken(). Route guards built on
// this hook (ProtectedRoute, ProtectedRoutesLayout) must keep rendering protected content
// through an access-token expiry — the axios interceptor silently refreshes it on the next
// request. If this used getAuthToken() instead, the token would self-clear and this hook
// would flip to "logged out" purely from a render happening after expiry, with no request
// or refresh attempt ever occurring — kicking the user out before the interceptor gets a
// chance to run.
export const useAuthToken = () => {
  return useSyncExternalStore(subscribeToAuthTokenChanges, getRawAuthToken, getRawAuthToken);
};
