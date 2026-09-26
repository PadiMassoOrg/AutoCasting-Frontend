import { jwtDecoder } from '../utils/jwtDecoder';
import { AUTH_TOKEN_CHANGE_EVENT, AUTH_TOKEN_SYNC_STORAGE_KEY, getRawAuthToken } from './cookies';

const listeners = new Set<() => void>();

const subjectOf = (token: string | undefined) => (token ? (jwtDecoder(token)?.sub ?? null) : null);

let ownSubject: string | null = null;
let sessionFromOtherTab = false;

const setSessionFromOtherTab = (next: boolean) => {
  if (next === sessionFromOtherTab) return;
  sessionFromOtherTab = next;
  listeners.forEach((listener) => listener());
};

const handleOwnTokenChange = () => {
  ownSubject = subjectOf(getRawAuthToken());
  setSessionFromOtherTab(false);
};

const handleOtherTabTokenChange = (event: StorageEvent) => {
  if (event.key !== AUTH_TOKEN_SYNC_STORAGE_KEY) return;
  const subject = subjectOf(getRawAuthToken());
  setSessionFromOtherTab(subject !== null && subject !== ownSubject);
};

if (typeof window !== 'undefined') {
  ownSubject = subjectOf(getRawAuthToken());
  window.addEventListener(AUTH_TOKEN_CHANGE_EVENT, handleOwnTokenChange);
  window.addEventListener('storage', handleOtherTabTokenChange);
}

export const isSessionFromOtherTab = () => sessionFromOtherTab;

export const subscribeToSessionFromOtherTab = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
