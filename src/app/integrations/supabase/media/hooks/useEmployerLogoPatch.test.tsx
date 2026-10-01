import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useEmployerLogoPatch } from './useEmployerLogoPatch';

const patchMock = vi.fn();
const uploadPublicMock = vi.fn();
const removeByPublicUrlMock = vi.fn();
const optimizeMock = vi.fn();

vi.mock('autocasting-ui-library-padimasso', () => ({ showToast: vi.fn() }));
vi.mock('i18next', () => ({ default: { t: (key: string) => key } }));

vi.mock('../../../../features/employer/employer-profile-edit/services/employerProfileService', () => ({
  EMPLOYER_PROFILE_CACHE_KEY: ['cache-employer'],
  patchEmployerBasicInfo: (...args: unknown[]) => patchMock(...args),
}));

vi.mock('../lib/profile-media', () => ({
  uploadPublic: (...args: unknown[]) => uploadPublicMock(...args),
  removeByPublicUrl: (...args: unknown[]) => removeByPublicUrlMock(...args),
}));

vi.mock('../lib/imageOptimization', () => ({
  assertImageSourceSize: vi.fn(),
  isHeicImage: () => false,
  optimizeImageForUpload: (...args: unknown[]) => optimizeMock(...args),
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    {children}
  </QueryClientProvider>
);

const file = new File(['content'], 'logo.jpg', { type: 'image/jpeg' });

describe('useEmployerLogoPatch', () => {
  beforeEach(() => {
    [patchMock, uploadPublicMock, removeByPublicUrlMock, optimizeMock].forEach((m) => m.mockReset());
    optimizeMock.mockImplementation(async (f: File) => f);
    uploadPublicMock.mockResolvedValue({ publicUrl: 'https://cdn/logo.webp', key: 'employer/e1/logo/1.webp' });
    patchMock.mockResolvedValue({ imageUrl: 'https://cdn/logo.webp' });
  });

  it('uploads a logo thumbnail next to the optimized logo', async () => {
    const { result } = renderHook(() => useEmployerLogoPatch('e1'), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ file });
    });

    expect(optimizeMock).toHaveBeenNthCalledWith(2, expect.any(File), 'employer-logo-thumbnail');
    expect(uploadPublicMock.mock.calls[1][0]).toBe('employer/e1/logo/1.webp.thumb.webp');
    expect(patchMock).toHaveBeenCalledWith({ imageUrl: 'https://cdn/logo.webp' });
  });

  it('still saves the logo when the thumbnail upload fails', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    uploadPublicMock
      .mockResolvedValueOnce({ publicUrl: 'https://cdn/logo.webp', key: 'employer/e1/logo/1.webp' })
      .mockRejectedValueOnce(new Error('thumbnail failed'));

    const { result } = renderHook(() => useEmployerLogoPatch('e1'), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ file });
    });

    expect(patchMock).toHaveBeenCalledWith({ imageUrl: 'https://cdn/logo.webp' });
    expect(removeByPublicUrlMock).not.toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
