import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useProfileMediaDelete } from './useProfileMediaDelete';

const patchMediaMock = vi.fn();
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
  removeByPublicUrl: (...args: unknown[]) => removeByPublicUrlMock(...args),
}));

const wrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  vi.spyOn(queryClient, 'invalidateQueries').mockImplementation(invalidateQueriesMock);
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('useProfileMediaDelete', () => {
  beforeEach(() => {
    patchMediaMock.mockReset();
    removeByPublicUrlMock.mockReset();
    showToastMock.mockReset();
    invalidateQueriesMock.mockReset();
    invalidateTalentDatabaseMock.mockReset();
  });

  it('invalidates both the talent profile cache and the public talent database cache on success', async () => {
    removeByPublicUrlMock.mockResolvedValue(undefined);
    patchMediaMock.mockResolvedValue({ headshotImageUrl: null });

    const { result } = renderHook(() => useProfileMediaDelete(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ slot: 'headshot', url: 'https://cdn/headshot.jpg' });
    });

    // Regression: deleting the last required photo removes this talent from catalog eligibility
    // — the same reasoning applies as for useProfileMediaPatch. Previously only the "my own
    // profile" cache was invalidated, so an already-open catalog tab kept showing the talent as
    // visible until a full page reload.
    await waitFor(() => expect(invalidateTalentDatabaseMock).toHaveBeenCalledTimes(1));
    expect(invalidateQueriesMock).toHaveBeenCalledWith(expect.objectContaining({ queryKey: ['cache-profile'] }));
  });

  it('still patches the media to null even if removing the previous storage object fails', async () => {
    removeByPublicUrlMock.mockRejectedValue(new Error('storage error'));
    patchMediaMock.mockResolvedValue({ headshotImageUrl: null });

    const { result } = renderHook(() => useProfileMediaDelete(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ slot: 'headshot', url: 'https://cdn/headshot.jpg' });
    });

    expect(patchMediaMock).toHaveBeenCalledWith({ headshotImageUrl: null });
    expect(showToastMock).toHaveBeenCalledTimes(1);
  });
});
