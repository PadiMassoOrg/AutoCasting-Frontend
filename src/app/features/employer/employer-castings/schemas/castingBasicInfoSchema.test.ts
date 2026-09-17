import { describe, expect, it } from 'vitest';
import type { TFunction } from 'i18next';
import { getCastingBasicInfoSchema } from './castingBasicInfoSchema';

const t = ((key: string) => key) as TFunction;

const validPayload = {
  title: 'Lead role casting',
  projectTypeId: '11111111-1111-4111-8111-111111111111',
  castingModalityId: '22222222-2222-4222-8222-222222222222',
  locationText: 'Buenos Aires',
  applicationDeadline: '2026-12-31',
  hasWardrobeFitting: false,
  wardrobeFittingText: undefined,
  shootingStartDate: '2027-01-10',
  shootingEndDate: '2027-01-20',
  description: 'A short description',
};

describe('getCastingBasicInfoSchema', () => {
  it('accepts a fully valid payload', () => {
    const result = getCastingBasicInfoSchema(t).safeParse(validPayload);

    expect(result.success).toBe(true);
  });

  describe('title', () => {
    it('rejects an empty title', () => {
      const result = getCastingBasicInfoSchema(t).safeParse({ ...validPayload, title: '' });

      expect(result.success).toBe(false);
    });

    it('rejects a title longer than 255 characters', () => {
      const result = getCastingBasicInfoSchema(t).safeParse({ ...validPayload, title: 'a'.repeat(256) });

      expect(result.success).toBe(false);
    });

    it('capitalizes a shouting title', () => {
      const result = getCastingBasicInfoSchema(t).safeParse({ ...validPayload, title: 'LEAD ROLE CASTING' });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe('Lead Role Casting');
      }
    });

    it('leaves a non-shouting title unchanged', () => {
      const result = getCastingBasicInfoSchema(t).safeParse({ ...validPayload, title: 'Lead role casting' });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe('Lead role casting');
      }
    });
  });

  describe('optional UUID fields', () => {
    it('rejects a malformed projectTypeId', () => {
      const result = getCastingBasicInfoSchema(t).safeParse({ ...validPayload, projectTypeId: 'not-a-uuid' });

      expect(result.success).toBe(false);
    });

    it('treats an empty string projectTypeId as absent', () => {
      const result = getCastingBasicInfoSchema(t).safeParse({ ...validPayload, projectTypeId: '' });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.projectTypeId).toBeUndefined();
      }
    });

    it('allows projectTypeId/castingModalityId to be omitted entirely', () => {
      const { projectTypeId, castingModalityId, ...rest } = validPayload;
      const result = getCastingBasicInfoSchema(t).safeParse(rest);

      expect(result.success).toBe(true);
    });
  });

  describe('date fields', () => {
    it('rejects a non-ISO applicationDeadline', () => {
      const result = getCastingBasicInfoSchema(t).safeParse({ ...validPayload, applicationDeadline: '31/12/2026' });

      expect(result.success).toBe(false);
    });

    it('treats an empty string date as absent', () => {
      const result = getCastingBasicInfoSchema(t).safeParse({ ...validPayload, applicationDeadline: '' });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.applicationDeadline).toBeUndefined();
      }
    });

    it('accepts a well-formed ISO date', () => {
      const result = getCastingBasicInfoSchema(t).safeParse({ ...validPayload, shootingStartDate: '2027-05-01' });

      expect(result.success).toBe(true);
    });
  });

  describe('wardrobeFittingText', () => {
    // NOTE: unlike the backend's hasCompleteBasicInfo (which requires wardrobeFittingText
    // whenever hasWardrobeFitting is true), this schema has no such cross-field rule —
    // wardrobeFittingText is unconditionally optional here. A payload with
    // hasWardrobeFitting: true and no wardrobeFittingText passes this schema but would be
    // rejected as "not publishable" by the backend. Flagged per AI-31 scope; not silently
    // asserting the frontend's behavior as correct — see the mismatch note below.
    it('DIVERGENCE FROM BACKEND: passes validation even when hasWardrobeFitting is true and wardrobeFittingText is missing', () => {
      const result = getCastingBasicInfoSchema(t).safeParse({
        ...validPayload,
        hasWardrobeFitting: true,
        wardrobeFittingText: undefined,
      });

      expect(result.success).toBe(true);
    });

    it('accepts wardrobeFittingText when provided alongside hasWardrobeFitting: true', () => {
      const result = getCastingBasicInfoSchema(t).safeParse({
        ...validPayload,
        hasWardrobeFitting: true,
        wardrobeFittingText: 'Bring your own shoes',
      });

      expect(result.success).toBe(true);
    });

    it('capitalizes shouting wardrobeFittingText', () => {
      const result = getCastingBasicInfoSchema(t).safeParse({
        ...validPayload,
        hasWardrobeFitting: true,
        wardrobeFittingText: 'BRING YOUR OWN SHOES.',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.wardrobeFittingText).toBe('Bring your own shoes.');
      }
    });
  });

  describe('description', () => {
    it('rejects a description longer than 3000 characters', () => {
      const result = getCastingBasicInfoSchema(t).safeParse({ ...validPayload, description: 'a'.repeat(3001) });

      expect(result.success).toBe(false);
    });

    it('allows description to be omitted', () => {
      const { description, ...rest } = validPayload;
      const result = getCastingBasicInfoSchema(t).safeParse(rest);

      expect(result.success).toBe(true);
    });
  });
});
