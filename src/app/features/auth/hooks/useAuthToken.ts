import { useSyncExternalStore } from 'react';
import { getAuthToken, subscribeToAuthTokenChanges } from '../../../shared/lib/cookies';

export const useAuthToken = () => {
  return useSyncExternalStore(subscribeToAuthTokenChanges, getAuthToken, getAuthToken);
};
