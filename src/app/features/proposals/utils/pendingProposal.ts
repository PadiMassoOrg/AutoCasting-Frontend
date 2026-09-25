import { PENDING_PROPOSAL_STORAGE_KEY } from '../../../shared/lib/storageKeys';
import type { PendingProposal } from '../types/proposals.types';

export const PENDING_PROPOSAL_TTL_MS = 2 * 60 * 60 * 1000;

export const savePendingProposal = (pending: Omit<PendingProposal, 'savedAt'>, now = Date.now()) => {
  try {
    window.localStorage.setItem(PENDING_PROPOSAL_STORAGE_KEY, JSON.stringify({ ...pending, savedAt: now }));
  } catch {
    // ignore localStorage failures
  }
};

export const clearPendingProposal = () => {
  try {
    window.localStorage.removeItem(PENDING_PROPOSAL_STORAGE_KEY);
  } catch {
    // ignore localStorage failures
  }
};

export const readPendingProposal = (now = Date.now()): PendingProposal | null => {
  let pending: PendingProposal | null = null;
  try {
    const raw = window.localStorage.getItem(PENDING_PROPOSAL_STORAGE_KEY);
    pending = raw ? (JSON.parse(raw) as PendingProposal) : null;
  } catch {
    pending = null;
  }

  if (!pending?.token || typeof pending.savedAt !== 'number') return null;
  if (now - pending.savedAt > PENDING_PROPOSAL_TTL_MS) {
    clearPendingProposal();
    return null;
  }
  return pending;
};
