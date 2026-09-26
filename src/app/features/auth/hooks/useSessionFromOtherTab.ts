import { useSyncExternalStore } from 'react';
import { isSessionFromOtherTab, subscribeToSessionFromOtherTab } from '../../../shared/lib/crossTabSession';

export const useSessionFromOtherTab = () =>
  useSyncExternalStore(subscribeToSessionFromOtherTab, isSessionFromOtherTab, isSessionFromOtherTab);
