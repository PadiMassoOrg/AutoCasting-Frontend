import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it } from 'vitest';
import { vi } from 'vitest';
import { useCastingRolePhotoUpload } from './useCastingRolePhotoUpload';

const uploadPublicMock = vi.fn();

vi.mock('../lib/profile-media', () => ({
  uploadPublic: (...args: unknown[]) => uploadPublicMock(...args),
}));

vi.mock('../lib/imageOptimization', () => ({
  assertImageSourceSize: vi.fn(),
  isHeicImage: () => false,
  optimizeImageForUpload: async (file: File) => file,
}));

const wrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

const file = new File(['content'], 'reference.jpg', { type: 'image/jpeg' });

describe('useCastingRolePhotoUpload', () => {
  beforeEach(() => {
    uploadPublicMock.mockReset();
  });

  it('uploads the file and returns its public URL', async () => {
    uploadPublicMock.mockResolvedValue({ publicUrl: 'https://cdn/reference.jpg', key: 'key' });

    const { result } = renderHook(() => useCastingRolePhotoUpload('employer-1', 'casting-1'), { wrapper });

    let returnedUrl: string | undefined;
    await act(async () => {
      returnedUrl = await result.current.mutateAsync({ file });
    });

    expect(returnedUrl).toBe('https://cdn/reference.jpg');
  });

  it('uploads to the employer/{employerId}/castings/{castingId}/role-reference-photos folder', async () => {
    uploadPublicMock.mockResolvedValue({ publicUrl: 'https://cdn/reference.jpg', key: 'key' });

    const { result } = renderHook(() => useCastingRolePhotoUpload('employer-1', 'casting-1'), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ file });
    });

    expect(uploadPublicMock).toHaveBeenCalledWith(
      expect.stringMatching(/^employer\/employer-1\/castings\/casting-1\/role-reference-photos\/\d+\.jpg$/),
      file
    );
  });

  // This hook never deletes the previous photo itself — a role draft can be discarded without
  // being saved, so deleting eagerly here could remove a file still referenced by the
  // persisted role. See CastingRoleForm's pendingPhotoDeletes queue, flushed by the parent
  // page only once the role save actually succeeds.
  it('does not delete anything itself', async () => {
    uploadPublicMock.mockResolvedValue({ publicUrl: 'https://cdn/new.jpg', key: 'key' });

    const { result } = renderHook(() => useCastingRolePhotoUpload('employer-1', 'casting-1'), { wrapper });

    let returnedUrl: string | undefined;
    await act(async () => {
      returnedUrl = await result.current.mutateAsync({ file });
    });

    expect(returnedUrl).toBe('https://cdn/new.jpg');
  });
});
