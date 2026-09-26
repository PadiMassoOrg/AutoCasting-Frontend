import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PENDING_PROPOSAL_STORAGE_KEY } from '../../../shared/lib/storageKeys';
import { logout, logoutInPlace } from './authService';

const forceLogoutRedirectMock = vi.fn();
const clearClientSessionMock = vi.fn();

vi.mock('../../../shared/lib/axios', () => ({ default: { post: vi.fn(() => Promise.resolve()) } }));
vi.mock('../../../shared/lib/cookies', () => ({ getRawAuthToken: vi.fn(), getRefreshToken: () => undefined }));
vi.mock('../../../shared/lib/authSession', () => ({
  forceLogoutRedirect: () => forceLogoutRedirectMock(),
  clearClientSession: () => clearClientSessionMock(),
}));

describe('authService logout', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem(
      PENDING_PROPOSAL_STORAGE_KEY,
      JSON.stringify({ token: 'token-1', savedAt: Date.now() })
    );
    forceLogoutRedirectMock.mockReset();
    clearClientSessionMock.mockReset();
  });

  it('an explicit logout discards the pending proposal', () => {
    logout();

    expect(window.localStorage.getItem(PENDING_PROPOSAL_STORAGE_KEY)).toBeNull();
    expect(forceLogoutRedirectMock).toHaveBeenCalledTimes(1);
  });

  it('logging out to claim keeps the pending proposal', () => {
    logoutInPlace();

    expect(window.localStorage.getItem(PENDING_PROPOSAL_STORAGE_KEY)).not.toBeNull();
    expect(clearClientSessionMock).toHaveBeenCalledTimes(1);
  });
});
