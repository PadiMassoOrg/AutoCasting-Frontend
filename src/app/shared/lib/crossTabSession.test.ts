import Cookies from 'js-cookie';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AUTH_TOKEN_CHANGE_EVENT, AUTH_TOKEN_SYNC_STORAGE_KEY } from './cookies';

const jwt = (sub: string) => `h.${btoa(JSON.stringify({ sub, exp: Math.floor(Date.now() / 1000) + 3600 }))}.s`;

const loginInThisTab = (sub: string) => {
  Cookies.set('authToken', jwt(sub));
  window.dispatchEvent(new Event(AUTH_TOKEN_CHANGE_EVENT));
};

const changeInOtherTab = (sub: string | null) => {
  if (sub) Cookies.set('authToken', jwt(sub));
  else Cookies.remove('authToken');
  window.dispatchEvent(new StorageEvent('storage', { key: AUTH_TOKEN_SYNC_STORAGE_KEY }));
};

const loadModule = async () => {
  vi.resetModules();
  return import('./crossTabSession');
};

describe('crossTabSession', () => {
  beforeEach(() => {
    Cookies.remove('authToken');
  });

  it('is not flagged for a session started in this tab', async () => {
    const { isSessionFromOtherTab } = await loadModule();

    loginInThisTab('a@test.com');

    expect(isSessionFromOtherTab()).toBe(false);
  });

  it('flags a different account logged in from another tab', async () => {
    loginInThisTab('a@test.com');
    const { isSessionFromOtherTab } = await loadModule();

    changeInOtherTab(null);
    changeInOtherTab('b@test.com');

    expect(isSessionFromOtherTab()).toBe(true);
  });

  it('does not flag the same account refreshing its token in another tab', async () => {
    loginInThisTab('a@test.com');
    const { isSessionFromOtherTab } = await loadModule();

    changeInOtherTab('a@test.com');

    expect(isSessionFromOtherTab()).toBe(false);
  });

  it('clears the flag once this tab logs in itself', async () => {
    const { isSessionFromOtherTab } = await loadModule();

    changeInOtherTab('b@test.com');
    expect(isSessionFromOtherTab()).toBe(true);

    loginInThisTab('b@test.com');
    expect(isSessionFromOtherTab()).toBe(false);
  });
});
