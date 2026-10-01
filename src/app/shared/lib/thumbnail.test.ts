import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SUPABASE } from '../../integrations/supabase/constants';
import { THUMBNAIL_SUFFIX, toThumbnailKey, toThumbnailUrl } from './thumbnail';

const ORIGIN = 'https://x.supabase.co';
const PUBLIC = `${ORIGIN}/storage/v1/object/public/${SUPABASE.MAIN_BUCKET}`;
const HEADSHOT = `${PUBLIC}/talent/p1/media/headshot/1727000000000.webp`;
const LOGO = `${PUBLIC}/employer/e1/logo/1727000000000.webp`;

describe('toThumbnailKey', () => {
  it('appends the thumbnail suffix to the full key', () => {
    expect(toThumbnailKey('talent/p1/media/headshot/1.webp')).toBe(
      `talent/p1/media/headshot/1.webp${THUMBNAIL_SUFFIX}`
    );
  });
});

describe('toThumbnailUrl', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_SUPABASE_URL', ORIGIN);
  });

  it('derives the thumbnail of an uploaded talent photo', () => {
    expect(toThumbnailUrl(HEADSHOT)).toBe(`${HEADSHOT}.thumb.webp`);
  });

  it('derives the thumbnail of an uploaded employer logo', () => {
    expect(toThumbnailUrl(LOGO)).toBe(`${LOGO}.thumb.webp`);
  });

  it('keeps legacy extensions in the derived URL', () => {
    const jpg = `${PUBLIC}/talent/p1/media/other/1700000000000.jpg`;
    expect(toThumbnailUrl(jpg)).toBe(`${jpg}.thumb.webp`);
  });

  it('drops query string and hash before appending', () => {
    expect(toThumbnailUrl(`${HEADSHOT}?b=2#x`)).toBe(`${HEADSHOT}.thumb.webp`);
  });

  it('does not append twice to a thumbnail URL', () => {
    expect(toThumbnailUrl(`${HEADSHOT}.thumb.webp`)).toBe(`${HEADSHOT}.thumb.webp`);
  });

  it('returns null for empty values', () => {
    expect(toThumbnailUrl(null)).toBeNull();
    expect(toThumbnailUrl(undefined)).toBeNull();
    expect(toThumbnailUrl('')).toBeNull();
  });

  it('returns null for seed data and other files not created by the upload code', () => {
    expect(toThumbnailUrl(`${PUBLIC}/talent/p1/media/headshot/b6adeb92-127e-4fc3-a82b-1bbcdf2d50ec.png`)).toBeNull();
    expect(toThumbnailUrl(`${PUBLIC}/castings/c1/role-reference-photos/1727000000000.webp`)).toBeNull();
  });

  it('returns null for another bucket or another Supabase project', () => {
    expect(toThumbnailUrl(HEADSHOT.replace(SUPABASE.MAIN_BUCKET, 'other-bucket'))).toBeNull();
    expect(toThumbnailUrl(HEADSHOT.replace(ORIGIN, 'https://y.supabase.co'))).toBeNull();
  });

  it('returns null for URLs outside Supabase storage', () => {
    expect(toThumbnailUrl('https://example.com/photo.jpg')).toBeNull();
  });

  it('returns null when the Supabase URL is not configured', () => {
    vi.stubEnv('VITE_SUPABASE_URL', '');
    expect(toThumbnailUrl(HEADSHOT)).toBeNull();
  });
});
