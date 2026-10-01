import { beforeEach, describe, expect, it, vi } from 'vitest';
import { removeByPublicUrl } from './profile-media';

const removeMock = vi.fn();

vi.mock('../../../../shared/lib/supabase', () => ({
  supabase: { storage: { from: () => ({ remove: (...args: unknown[]) => removeMock(...args) }) } },
}));

vi.mock('../../constants', () => ({
  SUPABASE: { MAIN_BUCKET: 'bucket' },
}));

const URL = 'https://x.supabase.co/storage/v1/object/public/bucket/talent/p1/media/headshot/1.webp';

describe('removeByPublicUrl', () => {
  beforeEach(() => {
    removeMock.mockReset();
    removeMock.mockResolvedValue({ error: null });
  });

  it('removes the photo and its thumbnail in one call', async () => {
    await removeByPublicUrl(`${URL}?b=1`);
    expect(removeMock).toHaveBeenCalledWith([
      'talent/p1/media/headshot/1.webp',
      'talent/p1/media/headshot/1.webp.thumb.webp',
    ]);
  });

  it('rejects a URL outside the media bucket', async () => {
    await expect(removeByPublicUrl('https://example.com/a.jpg')).rejects.toThrow();
    expect(removeMock).not.toHaveBeenCalled();
  });

  it('throws when storage returns an error', async () => {
    removeMock.mockResolvedValue({ error: new Error('boom') });
    await expect(removeByPublicUrl(URL)).rejects.toThrow('boom');
  });
});
