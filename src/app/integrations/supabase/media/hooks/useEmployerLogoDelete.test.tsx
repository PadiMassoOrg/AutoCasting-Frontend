import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useEmployerLogoDelete } from './useEmployerLogoDelete';

const patchEmployerBasicInfoMock = vi.fn();
const removeByPublicUrlMock = vi.fn();
const showToastMock = vi.fn();

vi.mock('autocasting-ui-library-padimasso', () => ({
  showToast: (...args: unknown[]) => showToastMock(...args),
}));

vi.mock('i18next', () => ({
  default: { t: (key: string) => key },
}));

vi.mock('../../../../features/employer/employer-profile-edit/services/employerProfileService', () => ({
  EMPLOYER_PROFILE_CACHE_KEY: ['employer-cache-profile'],
  patchEmployerBasicInfo: (...args: unknown[]) => patchEmployerBasicInfoMock(...args),
}));

vi.mock('../lib/profile-media', () => ({
  removeByPublicUrl: (...args: unknown[]) => removeByPublicUrlMock(...args),
}));

const wrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('useEmployerLogoDelete', () => {
  beforeEach(() => {
    patchEmployerBasicInfoMock.mockReset();
    removeByPublicUrlMock.mockReset();
    showToastMock.mockReset();
  });

  it('clears imageUrl in the backend and removes the file from storage', async () => {
    patchEmployerBasicInfoMock.mockResolvedValue({ imageUrl: null });
    removeByPublicUrlMock.mockResolvedValue(undefined);

    const { result } = renderHook(() => useEmployerLogoDelete(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ url: 'https://cdn/logo.jpg' });
    });

    expect(patchEmployerBasicInfoMock).toHaveBeenCalledWith({ imageUrl: null });
    expect(removeByPublicUrlMock).toHaveBeenCalledWith('https://cdn/logo.jpg');
    expect(showToastMock).not.toHaveBeenCalled();
  });

  it('does not remove the storage file if clearing imageUrl fails', async () => {
    patchEmployerBasicInfoMock.mockRejectedValue(new Error('backend error'));

    const { result } = renderHook(() => useEmployerLogoDelete(), { wrapper });

    await act(async () => {
      await expect(result.current.mutateAsync({ url: 'https://cdn/logo.jpg' })).rejects.toThrow('backend error');
    });

    expect(removeByPublicUrlMock).not.toHaveBeenCalled();
  });

  it('still succeeds and warns if removing the storage file fails', async () => {
    patchEmployerBasicInfoMock.mockResolvedValue({ imageUrl: null });
    removeByPublicUrlMock.mockRejectedValue(new Error('storage error'));
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useEmployerLogoDelete(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ url: 'https://cdn/logo.jpg' });
    });

    expect(showToastMock).toHaveBeenCalledTimes(1);
  });

  it('skips storage removal when there is no current logo', async () => {
    patchEmployerBasicInfoMock.mockResolvedValue({ imageUrl: null });

    const { result } = renderHook(() => useEmployerLogoDelete(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ url: null });
    });

    expect(removeByPublicUrlMock).not.toHaveBeenCalled();
  });
});
