import { describe, expect, it } from 'vitest';
import type { TFunction } from 'i18next';
import { getEmployerBasicInfoSchema } from './emplyoerBasicInfoStepSchema';

const t = ((key: string) => key) as TFunction;

describe('getEmployerBasicInfoSchema (onboarding)', () => {
  it('accepts a payload with only companyName', () => {
    const result = getEmployerBasicInfoSchema(t).safeParse({ companyName: 'Acme Productions' });

    expect(result.success).toBe(true);
  });

  it('rejects an empty companyName', () => {
    const result = getEmployerBasicInfoSchema(t).safeParse({ companyName: '   ' });

    expect(result.success).toBe(false);
  });

  it('does not output a taxNumber', () => {
    const result = getEmployerBasicInfoSchema(t).safeParse({ companyName: 'Acme', taxNumber: '30-12345678-9' });

    expect(result.success).toBe(true);
    if (result.success) {
      expect('taxNumber' in result.data).toBe(false);
    }
  });

  it('capitalizes a shouting companyName', () => {
    const result = getEmployerBasicInfoSchema(t).safeParse({ companyName: 'ACME PRODUCTIONS' });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.companyName).toBe('Acme Productions');
    }
  });
});
