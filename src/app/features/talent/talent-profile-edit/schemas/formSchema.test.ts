import { describe, expect, it } from 'vitest';
import type { TFunction } from 'i18next';
import { getCreditSchema, getEducationSchema } from './formSchema';

const t = ((key: string) => key) as TFunction;

describe('getEducationSchema', () => {
  const validPayload = {
    institution: 'NYU',
    courseName: 'acting fundamentals',
    graduationYear: '2020',
  };

  it('accepts a fully valid payload', () => {
    const result = getEducationSchema(t).safeParse(validPayload);

    expect(result.success).toBe(true);
  });

  describe('courseName (title-like: always title-cased)', () => {
    it('title-cases a lowercase courseName', () => {
      const result = getEducationSchema(t).safeParse({ ...validPayload, courseName: 'acting fundamentals' });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.courseName).toBe('Acting Fundamentals');
      }
    });

    it('title-cases a shouting courseName (not just capitalizing the first letter)', () => {
      const result = getEducationSchema(t).safeParse({ ...validPayload, courseName: 'ACTING FUNDAMENTALS' });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.courseName).toBe('Acting Fundamentals');
      }
    });

    it('rejects an empty courseName', () => {
      const result = getEducationSchema(t).safeParse({ ...validPayload, courseName: '' });

      expect(result.success).toBe(false);
    });
  });

  describe('institution (name-like: shout-only capitalization)', () => {
    it('leaves a non-shouting institution unchanged', () => {
      const result = getEducationSchema(t).safeParse({ ...validPayload, institution: 'nyu film school' });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.institution).toBe('nyu film school');
      }
    });

    it('title-cases a shouting institution', () => {
      const result = getEducationSchema(t).safeParse({ ...validPayload, institution: 'NYU FILM SCHOOL' });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.institution).toBe('Nyu Film School');
      }
    });
  });

  describe('graduationYear', () => {
    it('rejects a non-4-digit year', () => {
      const result = getEducationSchema(t).safeParse({ ...validPayload, graduationYear: '20' });

      expect(result.success).toBe(false);
    });
  });
});

describe('getCreditSchema', () => {
  const validPayload = {
    productionType: '11111111-1111-4111-8111-111111111111',
    projectName: 'the last light',
    producerName: 'jane doe',
    role: 'lead actor',
    year: '2022',
  };

  it('accepts a fully valid payload', () => {
    const result = getCreditSchema(t).safeParse(validPayload);

    expect(result.success).toBe(true);
  });

  describe('projectName (title-like: always title-cased)', () => {
    it('title-cases a lowercase projectName', () => {
      const result = getCreditSchema(t).safeParse({ ...validPayload, projectName: 'the last light' });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.projectName).toBe('The Last Light');
      }
    });

    it('title-cases a shouting projectName', () => {
      const result = getCreditSchema(t).safeParse({ ...validPayload, projectName: 'THE LAST LIGHT' });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.projectName).toBe('The Last Light');
      }
    });
  });

  describe('role (title-like: always title-cased)', () => {
    it('title-cases a lowercase role', () => {
      const result = getCreditSchema(t).safeParse({ ...validPayload, role: 'lead actor' });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.role).toBe('Lead Actor');
      }
    });
  });

  describe('producerName (name-like: shout-only capitalization)', () => {
    it('leaves a non-shouting producerName unchanged', () => {
      const result = getCreditSchema(t).safeParse({ ...validPayload, producerName: 'jane doe' });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.producerName).toBe('jane doe');
      }
    });

    it('title-cases a shouting producerName', () => {
      const result = getCreditSchema(t).safeParse({ ...validPayload, producerName: 'JANE DOE' });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.producerName).toBe('Jane Doe');
      }
    });
  });

  describe('productionType', () => {
    it('rejects a non-UUID productionType', () => {
      const result = getCreditSchema(t).safeParse({ ...validPayload, productionType: 'not-a-uuid' });

      expect(result.success).toBe(false);
    });
  });

  describe('year', () => {
    it('rejects a non-4-digit year', () => {
      const result = getCreditSchema(t).safeParse({ ...validPayload, year: '22' });

      expect(result.success).toBe(false);
    });
  });
});

describe('free text fields accept any printable character', () => {
  it('accepts punctuation such as ":" in credit and education text', () => {
    const credit = getCreditSchema(t).safeParse({
      productionType: '3f2b8c1e-9d4a-4b7e-8a5c-1d2e3f4a5b6c',
      projectName: 'Campaña Urbana: Voces de Ciudad',
      producerName: 'Sur Content / Producciones!',
      role: 'Lead (voz) "A"',
      year: '2024',
    });
    const education = getEducationSchema(t).safeParse({
      institution: 'Escuela: Nacional de Arte',
      courseName: 'Actuación: nivel 1',
      graduationYear: '2020',
    });

    expect(credit.success).toBe(true);
    expect(education.success).toBe(true);
  });

  it('still rejects control characters', () => {
    const result = getEducationSchema(t).safeParse({
      institution: 'NYU\u0000',
      courseName: 'Acting',
      graduationYear: '2020',
    });

    expect(result.success).toBe(false);
  });
});
