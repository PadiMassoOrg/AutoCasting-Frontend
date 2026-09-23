import { describe, expect, it } from 'vitest';
import type { TFunction } from 'i18next';
import { getEmployerBasicInfoSchema } from './employerBasicInfoSchema';

const t = ((key: string) => key) as TFunction;

const validPayload = {
  companyName: 'Acme Productions',
  taxNumber: '30-12345678-9',
  companyTypeId: '11111111-1111-4111-8111-111111111111',
  companyEmail: 'contact@acme.com',
  address: 'Main St 123',
  websiteUrl: 'https://acme.com',
  about: 'A short bio',
};

describe('getEmployerBasicInfoSchema', () => {
  it('accepts a fully valid payload', () => {
    const result = getEmployerBasicInfoSchema(t).safeParse(validPayload);

    expect(result.success).toBe(true);
  });

  describe('companyName', () => {
    it('rejects an empty companyName', () => {
      const result = getEmployerBasicInfoSchema(t).safeParse({ ...validPayload, companyName: '' });

      expect(result.success).toBe(false);
    });

    it('rejects a companyName longer than 255 characters', () => {
      const result = getEmployerBasicInfoSchema(t).safeParse({ ...validPayload, companyName: 'a'.repeat(256) });

      expect(result.success).toBe(false);
    });

    it('capitalizes a shouting companyName', () => {
      const result = getEmployerBasicInfoSchema(t).safeParse({ ...validPayload, companyName: 'ACME PRODUCTIONS' });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.companyName).toBe('Acme Productions');
      }
    });
  });

  describe('taxNumber', () => {
    it('rejects an empty taxNumber', () => {
      const result = getEmployerBasicInfoSchema(t).safeParse({ ...validPayload, taxNumber: '' });

      expect(result.success).toBe(false);
    });

    it('rejects a taxNumber with invalid characters', () => {
      const result = getEmployerBasicInfoSchema(t).safeParse({ ...validPayload, taxNumber: '30@#$%' });

      expect(result.success).toBe(false);
    });

    it('accepts a taxNumber with digits, hyphens and spaces', () => {
      const result = getEmployerBasicInfoSchema(t).safeParse({ ...validPayload, taxNumber: '30 1234 5678-9' });

      expect(result.success).toBe(true);
    });
  });

  describe('companyTypeId', () => {
    it('rejects a malformed UUID', () => {
      const result = getEmployerBasicInfoSchema(t).safeParse({ ...validPayload, companyTypeId: 'not-a-uuid' });

      expect(result.success).toBe(false);
    });

    it('treats an empty string as absent', () => {
      const result = getEmployerBasicInfoSchema(t).safeParse({ ...validPayload, companyTypeId: '' });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.companyTypeId).toBeUndefined();
      }
    });

    it('allows companyTypeId to be omitted entirely', () => {
      const { companyTypeId, ...rest } = validPayload;
      const result = getEmployerBasicInfoSchema(t).safeParse(rest);

      expect(result.success).toBe(true);
    });
  });

  describe('companyEmail', () => {
    it('rejects an invalid email format', () => {
      const result = getEmployerBasicInfoSchema(t).safeParse({ ...validPayload, companyEmail: 'not-an-email' });

      expect(result.success).toBe(false);
    });

    it('treats an empty string as absent', () => {
      const result = getEmployerBasicInfoSchema(t).safeParse({ ...validPayload, companyEmail: '' });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.companyEmail).toBeUndefined();
      }
    });
  });

  describe('address / about', () => {
    it('rejects an address longer than 255 characters', () => {
      const result = getEmployerBasicInfoSchema(t).safeParse({ ...validPayload, address: 'a'.repeat(256) });

      expect(result.success).toBe(false);
    });

    it('capitalizes shouting address and about text', () => {
      const result = getEmployerBasicInfoSchema(t).safeParse({
        ...validPayload,
        address: 'MAIN STREET.',
        about: 'WE MAKE FILMS.',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.address).toBe('Main street.');
        expect(result.data.about).toBe('We make films.');
      }
    });

    it('allows address and about to be omitted', () => {
      const { address, about, ...rest } = validPayload;
      const result = getEmployerBasicInfoSchema(t).safeParse(rest);

      expect(result.success).toBe(true);
    });
  });

  describe('websiteUrl', () => {
    // AI-49: backend widened website_url from varchar(255) to text (Supabase-style URLs with
    // signed-URL query params routinely exceed 255 chars) — the frontend schema must not cap it either.
    it('accepts a websiteUrl longer than 255 characters', () => {
      const result = getEmployerBasicInfoSchema(t).safeParse({
        ...validPayload,
        websiteUrl: `https://${'a'.repeat(250)}.com`,
      });

      expect(result.success).toBe(true);
    });

    it('allows websiteUrl to be omitted', () => {
      const { websiteUrl, ...rest } = validPayload;
      const result = getEmployerBasicInfoSchema(t).safeParse(rest);

      expect(result.success).toBe(true);
    });
  });
});
