import { beforeEach, describe, expect, it } from 'vitest';
import { PENDING_PROPOSAL_STORAGE_KEY } from '../../../shared/lib/storageKeys';
import {
  clearPendingProposal,
  PENDING_PROPOSAL_TTL_MS,
  readPendingProposal,
  savePendingProposal,
} from './pendingProposal';

const pending = {
  token: 'token-1',
  typeCode: 'sitemetadata.proposal_type.casting',
  requirement: { code: 'EMPLOYER_ONBOARDING_COMPLETED' as const, requiredMode: 'EMPLOYER' as const },
};

describe('pendingProposal', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('reads back a saved pending proposal', () => {
    savePendingProposal(pending, 1_000);

    expect(readPendingProposal(1_000)).toEqual({ ...pending, savedAt: 1_000 });
  });

  it('keeps it until the TTL is reached', () => {
    savePendingProposal(pending, 0);

    expect(readPendingProposal(PENDING_PROPOSAL_TTL_MS)?.token).toBe('token-1');
  });

  it('discards and removes it once the TTL has passed', () => {
    savePendingProposal(pending, 0);

    expect(readPendingProposal(PENDING_PROPOSAL_TTL_MS + 1)).toBeNull();
    expect(window.localStorage.getItem(PENDING_PROPOSAL_STORAGE_KEY)).toBeNull();
  });

  it('clears it', () => {
    savePendingProposal(pending);
    clearPendingProposal();

    expect(readPendingProposal()).toBeNull();
  });

  it('returns null for malformed storage content', () => {
    window.localStorage.setItem(PENDING_PROPOSAL_STORAGE_KEY, '{not json');

    expect(readPendingProposal()).toBeNull();
  });
});
