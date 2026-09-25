import type { TFunction } from 'i18next';
import { describe, expect, it } from 'vitest';
import type { ProposalClaimResult } from '../types/proposals.types';
import { castingProposalRedirectTo, castingProposalSuccessToast } from './castingProposal';

const t = ((key: string) => key) as TFunction;

const result = (outcome: Record<string, unknown>): ProposalClaimResult => ({
  typeCode: 'sitemetadata.proposal_type.casting',
  associated: [{ entityType: 'CASTING', id: 'casting-id', slug: 'C-TEST0001' }],
  outcome,
});

describe('castingProposalRedirectTo', () => {
  it('goes to the castings list when the casting was published', () => {
    expect(castingProposalRedirectTo(result({ published: true }))).toBe('/dashboard/employer/castings');
  });

  it('goes to the casting editor when it stayed in draft', () => {
    expect(castingProposalRedirectTo(result({ published: false }))).toBe(
      '/dashboard/employer/casting/C-TEST0001/editor'
    );
  });
});

describe('castingProposalSuccessToast', () => {
  it('announces a published casting', () => {
    expect(castingProposalSuccessToast(result({ published: true }), t).description).toBe(
      'proposals.casting.claimed_published'
    );
  });

  it('asks to update the deadline when it has passed', () => {
    expect(
      castingProposalSuccessToast(result({ published: false, reason: 'castings.deadline_passed' }), t).description
    ).toBe('proposals.casting.claimed_draft_deadline');
  });

  it('falls back to a generic draft message', () => {
    expect(
      castingProposalSuccessToast(result({ published: false, reason: 'castings.not_publishable' }), t).description
    ).toBe('proposals.casting.claimed_draft');
  });
});
