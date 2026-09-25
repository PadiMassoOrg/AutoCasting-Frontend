import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearClientSession, forceLogoutRedirect } from './authSession';
import { ROUTES } from './routes';

const clearAuthTokenMock = vi.fn();
const cancelQueriesMock = vi.fn();

vi.mock('./cookies', () => ({ clearAuthToken: () => clearAuthTokenMock() }));
vi.mock('./queryClient', () => ({
  queryClient: { cancelQueries: (filters: unknown) => cancelQueriesMock(filters), removeQueries: vi.fn() },
}));

const originalLocation = window.location;
const replaceMock = vi.fn();

const visit = (pathname: string) => {
  Object.defineProperty(window, 'location', { configurable: true, value: { pathname, replace: replaceMock } });
};

describe('forceLogoutRedirect', () => {
  beforeEach(() => {
    clearAuthTokenMock.mockReset();
    replaceMock.mockReset();
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', { configurable: true, value: originalLocation });
  });

  it('clears the session and redirects home', () => {
    visit('/dashboard/employer/castings');

    forceLogoutRedirect();

    expect(clearAuthTokenMock).toHaveBeenCalledTimes(1);
    expect(replaceMock).toHaveBeenCalledWith(ROUTES.HOME);
  });

  it('clears the session without leaving a proposal link', () => {
    visit('/proposal/token-1');

    forceLogoutRedirect();

    expect(clearAuthTokenMock).toHaveBeenCalledTimes(1);
    expect(replaceMock).not.toHaveBeenCalled();
  });
});

describe('clearClientSession', () => {
  it('does not cancel queries flagged to survive logout', () => {
    cancelQueriesMock.mockReset();

    clearClientSession();

    const { predicate } = cancelQueriesMock.mock.calls[0][0] as { predicate: (query: { meta?: object }) => boolean };
    expect(predicate({ meta: { survivesLogout: true } })).toBe(false);
    expect(predicate({})).toBe(true);
  });
});
