import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { EmployerBasicInfoPatchRequest } from '../types/requests';
import { usePatchEmployerBasicInfoMutation } from './usePatchEmployerBasicInfoMutation';

const patchEmployerBasicInfoMock = vi.fn();
const invalidateQueriesMock = vi.fn();
const showToastMock = vi.fn();
const handleBackendLocalFieldOrToastErrorMock = vi.fn();

vi.mock('../services/employerProfileService', () => ({
  EMPLOYER_PROFILE_CACHE_KEY: ['employer-cache-profile'],
  patchEmployerBasicInfo: (...args: unknown[]) => patchEmployerBasicInfoMock(...args),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('../../../../context/ToastContext', () => ({
  useToast: () => ({ showToast: showToastMock }),
}));

vi.mock('../../../../shared/utils/backendErrorHandling', () => ({
  handleBackendLocalFieldOrToastError: (...args: unknown[]) => handleBackendLocalFieldOrToastErrorMock(...args),
}));

const wrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  vi.spyOn(queryClient, 'invalidateQueries').mockImplementation(invalidateQueriesMock);
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

const patchPayload: EmployerBasicInfoPatchRequest = { companyName: 'New Co' };

describe('usePatchEmployerBasicInfoMutation', () => {
  beforeEach(() => {
    patchEmployerBasicInfoMock.mockReset();
    invalidateQueriesMock.mockReset();
    showToastMock.mockReset();
    handleBackendLocalFieldOrToastErrorMock.mockReset();
  });

  it('submits the payload via patchEmployerBasicInfo', async () => {
    patchEmployerBasicInfoMock.mockResolvedValue({ id: 'basic-info-1', companyName: 'New Co' });

    const { result } = renderHook(() => usePatchEmployerBasicInfoMutation(), { wrapper });

    await act(async () => {
      await result.current.submit(patchPayload);
    });

    expect(patchEmployerBasicInfoMock).toHaveBeenCalledTimes(1);
    expect(patchEmployerBasicInfoMock.mock.calls[0][0]).toEqual(patchPayload);
  });

  it('invalidates the employer profile cache on success', async () => {
    patchEmployerBasicInfoMock.mockResolvedValue({ id: 'basic-info-1', companyName: 'New Co' });

    const { result } = renderHook(() => usePatchEmployerBasicInfoMutation(), { wrapper });

    await act(async () => {
      await result.current.submit(patchPayload);
    });

    await waitFor(() => expect(invalidateQueriesMock).toHaveBeenCalledWith({ queryKey: ['employer-cache-profile'] }));
  });

  it('clears field errors when a new submission starts', async () => {
    patchEmployerBasicInfoMock.mockRejectedValueOnce(new Error('first failure'));
    handleBackendLocalFieldOrToastErrorMock.mockImplementationOnce(({ setFieldError }) => {
      setFieldError('companyName', 'server error message');
    });

    const { result } = renderHook(() => usePatchEmployerBasicInfoMutation(), { wrapper });

    await act(async () => {
      await result.current.submit(patchPayload).catch(() => undefined);
    });

    await waitFor(() => expect(result.current.fieldErrors.companyName).toBe('server error message'));

    patchEmployerBasicInfoMock.mockResolvedValueOnce({ id: 'basic-info-1', companyName: 'New Co' });

    await act(async () => {
      await result.current.submit(patchPayload);
    });

    expect(result.current.fieldErrors).toEqual({});
  });

  it('delegates errors to handleBackendLocalFieldOrToastError on failure', async () => {
    const backendError = new Error('backend failure');
    patchEmployerBasicInfoMock.mockRejectedValue(backendError);

    const { result } = renderHook(() => usePatchEmployerBasicInfoMutation(), { wrapper });

    await act(async () => {
      await result.current.submit(patchPayload).catch(() => undefined);
    });

    expect(handleBackendLocalFieldOrToastErrorMock).toHaveBeenCalledTimes(1);
    const callArgs = handleBackendLocalFieldOrToastErrorMock.mock.calls[0][0];
    expect(callArgs.error).toBe(backendError);
  });

  it('clearFieldError removes only the targeted field', async () => {
    patchEmployerBasicInfoMock.mockRejectedValue(new Error('failure'));
    handleBackendLocalFieldOrToastErrorMock.mockImplementation(({ setFieldError }) => {
      setFieldError('companyName', 'company name error');
      setFieldError('taxNumber', 'tax number error');
    });

    const { result } = renderHook(() => usePatchEmployerBasicInfoMutation(), { wrapper });

    await act(async () => {
      await result.current.submit(patchPayload).catch(() => undefined);
    });

    await waitFor(() => expect(result.current.fieldErrors.companyName).toBe('company name error'));
    expect(result.current.fieldErrors.taxNumber).toBe('tax number error');

    act(() => {
      result.current.clearFieldError('companyName');
    });

    expect(result.current.fieldErrors.companyName).toBeUndefined();
    expect(result.current.fieldErrors.taxNumber).toBe('tax number error');
  });
});
