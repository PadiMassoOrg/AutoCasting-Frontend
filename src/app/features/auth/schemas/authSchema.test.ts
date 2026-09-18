import { describe, expect, it } from 'vitest';
import { getRegisterSchema } from './authSchema';

describe('getRegisterSchema', () => {
  it('accepts a valid email and password', () => {
    const result = getRegisterSchema().safeParse({ email: 'user@example.com', password: 'secret1' });

    expect(result.success).toBe(true);
  });

  it('trims the email', () => {
    const result = getRegisterSchema().safeParse({ email: '  user@example.com  ', password: 'secret1' });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('user@example.com');
    }
  });

  it('rejects a missing email', () => {
    const result = getRegisterSchema().safeParse({ email: '', password: 'secret1' });

    expect(result.success).toBe(false);
  });

  it('rejects an invalid email format', () => {
    const result = getRegisterSchema().safeParse({ email: 'not-an-email', password: 'secret1' });

    expect(result.success).toBe(false);
  });

  it('rejects an email longer than 255 characters', () => {
    const longEmail = `${'a'.repeat(250)}@x.com`;
    const result = getRegisterSchema().safeParse({ email: longEmail, password: 'secret1' });

    expect(result.success).toBe(false);
  });

  it('rejects a password shorter than 6 characters', () => {
    const result = getRegisterSchema().safeParse({ email: 'user@example.com', password: 'abc' });

    expect(result.success).toBe(false);
  });

  it('accepts a password exactly 6 characters long', () => {
    const result = getRegisterSchema().safeParse({ email: 'user@example.com', password: 'abcdef' });

    expect(result.success).toBe(true);
  });

  it('rejects a password longer than 255 characters', () => {
    const result = getRegisterSchema().safeParse({ email: 'user@example.com', password: 'a'.repeat(256) });

    expect(result.success).toBe(false);
  });
});
