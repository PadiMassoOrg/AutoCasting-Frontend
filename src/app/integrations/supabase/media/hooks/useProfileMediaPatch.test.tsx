import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useProfileMediaPatch } from './useProfileMediaPatch';

const patchMediaMock = vi.fn();
const uploadPublicMock = vi.fn();
const removeByPublicUrlMock = vi.fn();
const showToastMock = vi.fn();
const invalidateQueriesMock = vi.fn();
const invalidateTalentDatabaseMock = vi.fn();

vi.mock('autocasting-ui-library-padimasso', () => ({
  showToast: (...args: unknown[]) => showToastMock(...args),
}));

vi.mock('i18next', () => ({
  default: { t: (key: string) => key },
}));

vi.mock('../../../../features/talent/talent-profile-edit/services/talentProfileService', () => ({
  TALENT_PROFILE_CACHE_KEY: ['cache-profile'],
  patchMedia: (...args: unknown[]) => patchMediaMock(...args),
}));

vi.mock('../../../../features/talent-database/hooks/talentDatabaseInvalidation', () => ({
  invalidateTalentDatabase: (...args: unknown[]) => invalidateTalentDatabaseMock(...args),
}));

vi.mock('../lib/profile-media', () => ({
  uploadPublic: (...args: unknown[]) => uploadPublicMock(...args),
  removeByPublicUrl: (...args: unknown[]) => removeByPublicUrlMock(...args),
}));

vi.mock('../lib/imageOptimization', () => ({
  assertImageSourceSize: vi.fn(),
  isHeicImage: () => false,
  optimizeImageForUpload: async (file: File) => file,
}));

const wrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  vi.spyOn(queryClient, 'invalidateQueries').mockImplementation(invalidateQueriesMock);
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

const file = new File(['content'], 'headshot.jpg', { type: 'image/jpeg' });

describe('useProfileMediaPatch', () => {
  beforeEach(() => {
    patchMediaMock.mockReset();
    uploadPublicMock.mockReset();
    removeByPublicUrlMock.mockReset();
    showToastMock.mockReset();
    invalidateQueriesMock.mockReset();
    invalidateTalentDatabaseMock.mockReset();
  });

  it('invalidates both the talent profile cache and the public talent database cache on success', async () => {
    uploadPublicMock.mockResolvedValue({ publicUrl: 'https://cdn/headshot.jpg', key: 'key' });
    patchMediaMock.mockResolvedValue({ headshotImageUrl: 'https://cdn/headshot.jpg' });

    const { result } = renderHook(() => useProfileMediaPatch('profile-1'), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ file, slot: 'headshot' });
    });

    // Regression: this mutation can flip whether the talent is visible in the public catalog
    // (adding the last required photo), so it must invalidate the catalog cache too, not just
    // the "my own profile" edit-view cache — otherwise an already-open catalog tab keeps showing
    // stale data.
    await waitFor(() => expect(invalidateTalentDatabaseMock).toHaveBeenCalledTimes(1));
    expect(invalidateQueriesMock).toHaveBeenCalledWith(expect.objectContaining({ queryKey: ['cache-profile'] }));
  });
});
