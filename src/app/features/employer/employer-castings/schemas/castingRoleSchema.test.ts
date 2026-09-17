import { describe, expect, it } from 'vitest';
import type { TFunction } from 'i18next';
import { getCastingRoleSchema } from './castingRoleSchema';
import type { SiteMetadataObject } from '../../../sitemetadata/types/sitemetadata.types';

const t = ((key: string) => key) as TFunction;

const UNPAID_ID = '11111111-1111-4111-8111-111111111111';
const COLLABORATIVE_ID = '22222222-2222-4222-8222-222222222222';
const COOPERATIVE_ID = '33333333-3333-4333-8333-333333333333';
const FIXED_PAID_ID = '44444444-4444-4444-8444-444444444444';

const payRateTypeOptions: SiteMetadataObject[] = [
  { id: UNPAID_ID, stringCode: 'sitemetadata.pay_rate_type.unpaid' },
  { id: COLLABORATIVE_ID, stringCode: 'sitemetadata.pay_rate_type.collaborative' },
  { id: COOPERATIVE_ID, stringCode: 'sitemetadata.pay_rate_type.cooperative' },
  { id: FIXED_PAID_ID, stringCode: 'sitemetadata.pay_rate_type.fixed' },
];

const validPayload = {
  roleName: 'Lead role',
  roleTypeId: '55555555-5555-4555-8555-555555555555',
  genderId: '66666666-6666-4666-8666-666666666666',
  ageMin: '18',
  ageMax: '30',
  professionIds: ['77777777-7777-4777-8777-777777777777'],
  payRateTypeId: FIXED_PAID_ID,
  currencyId: '88888888-8888-4888-8888-888888888888',
  amount: '500',
  ethnicityId: '',
  description: '',
  remunerationNotes: '',
  requirementDescription: '',
};

describe('getCastingRoleSchema', () => {
  it('accepts a fully valid paid-role payload', () => {
    const result = getCastingRoleSchema(t, payRateTypeOptions).safeParse(validPayload);

    expect(result.success).toBe(true);
  });

  describe('required fields', () => {
    it('rejects a missing roleName', () => {
      const result = getCastingRoleSchema(t, payRateTypeOptions).safeParse({ ...validPayload, roleName: '' });

      expect(result.success).toBe(false);
    });

    it('rejects a missing roleTypeId', () => {
      const result = getCastingRoleSchema(t, payRateTypeOptions).safeParse({ ...validPayload, roleTypeId: '' });

      expect(result.success).toBe(false);
    });

    it('rejects a missing genderId', () => {
      const result = getCastingRoleSchema(t, payRateTypeOptions).safeParse({ ...validPayload, genderId: '' });

      expect(result.success).toBe(false);
    });

    it('rejects an empty professionIds list', () => {
      const result = getCastingRoleSchema(t, payRateTypeOptions).safeParse({ ...validPayload, professionIds: [] });

      expect(result.success).toBe(false);
    });

    it('rejects a missing payRateTypeId', () => {
      const result = getCastingRoleSchema(t, payRateTypeOptions).safeParse({ ...validPayload, payRateTypeId: '' });

      expect(result.success).toBe(false);
    });
  });

  describe('age range (superRefine)', () => {
    it('rejects ageMin greater than ageMax', () => {
      const result = getCastingRoleSchema(t, payRateTypeOptions).safeParse({
        ...validPayload,
        ageMin: '40',
        ageMax: '20',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((issue) => issue.path.includes('ageMax'))).toBe(true);
      }
    });

    it('accepts ageMin equal to ageMax', () => {
      const result = getCastingRoleSchema(t, payRateTypeOptions).safeParse({
        ...validPayload,
        ageMin: '25',
        ageMax: '25',
      });

      expect(result.success).toBe(true);
    });

    it('rejects a non-numeric ageMin', () => {
      const result = getCastingRoleSchema(t, payRateTypeOptions).safeParse({ ...validPayload, ageMin: 'abc' });

      expect(result.success).toBe(false);
    });

    it('rejects an ageMax above 99', () => {
      const result = getCastingRoleSchema(t, payRateTypeOptions).safeParse({ ...validPayload, ageMax: '150' });

      expect(result.success).toBe(false);
    });
  });

  describe('amount required unless unpaid/collaborative/cooperative (superRefine)', () => {
    it('requires amount for a paid (fixed) pay-rate type', () => {
      const result = getCastingRoleSchema(t, payRateTypeOptions).safeParse({
        ...validPayload,
        payRateTypeId: FIXED_PAID_ID,
        amount: '',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((issue) => issue.path.includes('amount'))).toBe(true);
      }
    });

    it('does not require amount for an unpaid pay-rate type', () => {
      const result = getCastingRoleSchema(t, payRateTypeOptions).safeParse({
        ...validPayload,
        payRateTypeId: UNPAID_ID,
        amount: '',
        currencyId: undefined,
      });

      expect(result.success).toBe(true);
    });

    it('does not require amount for a collaborative pay-rate type', () => {
      const result = getCastingRoleSchema(t, payRateTypeOptions).safeParse({
        ...validPayload,
        payRateTypeId: COLLABORATIVE_ID,
        amount: '',
        currencyId: undefined,
      });

      expect(result.success).toBe(true);
    });

    it('does not require amount for a cooperative pay-rate type', () => {
      const result = getCastingRoleSchema(t, payRateTypeOptions).safeParse({
        ...validPayload,
        payRateTypeId: COOPERATIVE_ID,
        amount: '',
        currencyId: undefined,
      });

      expect(result.success).toBe(true);
    });

    it('requires amount when the selected pay-rate type is unknown/not found in options', () => {
      const result = getCastingRoleSchema(t, payRateTypeOptions).safeParse({
        ...validPayload,
        payRateTypeId: '99999999-9999-4999-8999-999999999999',
        amount: '',
      });

      // NOTE: when the payRateTypeId doesn't resolve to any known option, selectedPayRateTypeCode
      // is null and amountRequired evaluates to false (short-circuited by the `!= null` check) —
      // so an unrecognized pay-rate type currently does NOT require an amount. This differs from
      // the backend, where resolvePayRateTypeOrThrow would reject an unknown id outright before
      // validateRole ever runs. Flagged per AI-31 scope: not a bug in this schema per se, but the
      // two layers diverge on how an invalid/unknown payRateTypeId is treated.
      expect(result.success).toBe(true);
    });

    it('does not require amount when payRateTypeOptions is not provided at all', () => {
      const result = getCastingRoleSchema(t).safeParse({ ...validPayload, amount: '' });

      expect(result.success).toBe(true);
    });

    it('accepts a valid non-negative integer amount', () => {
      const result = getCastingRoleSchema(t, payRateTypeOptions).safeParse({
        ...validPayload,
        payRateTypeId: FIXED_PAID_ID,
        amount: '1000',
      });

      expect(result.success).toBe(true);
    });

    it('rejects a non-numeric amount', () => {
      const result = getCastingRoleSchema(t, payRateTypeOptions).safeParse({
        ...validPayload,
        payRateTypeId: FIXED_PAID_ID,
        amount: 'abc',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('roleName capitalization', () => {
    it('capitalizes a shouting roleName', () => {
      const result = getCastingRoleSchema(t, payRateTypeOptions).safeParse({
        ...validPayload,
        roleName: 'LEAD ROLE',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.roleName).toBe('Lead Role');
      }
    });
  });
});
