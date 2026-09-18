import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { EmployerCastingCheckoutSummaryResponse } from '../types/employerCastings.types';
import { useEmployerCastingCheckoutSummary } from './useEmployerCastingCheckoutSummary';

const getEmployerCastingCheckoutSummaryMock = vi.fn();

vi.mock('../services/employerCastingService', () => ({
  getEmployerCastingCheckoutSummary: (...args: unknown[]) => getEmployerCastingCheckoutSummaryMock(...args),
}));

const summaryFixture: EmployerCastingCheckoutSummaryResponse = {
  id: 'casting-1',
  defaultCode: 'C-ABCDEF12',
  castingTitle: 'Feature Film Lead',
  projectType: null,
  castingModality: null,
  applicationDeadline: null,
  roles: [],
};

const wrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('useEmployerCastingCheckoutSummary', () => {
  beforeEach(() => {
    getEmployerCastingCheckoutSummaryMock.mockReset();
  });

  it('fetches the checkout summary for a given castingId', async () => {
    getEmployerCastingCheckoutSummaryMock.mockResolvedValue(summaryFixture);

    const { result } = renderHook(() => useEmployerCastingCheckoutSummary('casting-1'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(summaryFixture);
    expect(getEmployerCastingCheckoutSummaryMock).toHaveBeenCalledWith('casting-1');
  });

  it('does not fetch when castingId is missing', () => {
    renderHook(() => useEmployerCastingCheckoutSummary(undefined), { wrapper });

    expect(getEmployerCastingCheckoutSummaryMock).not.toHaveBeenCalled();
  });

  it('does not fetch when castingId is null', () => {
    renderHook(() => useEmployerCastingCheckoutSummary(null), { wrapper });

    expect(getEmployerCastingCheckoutSummaryMock).not.toHaveBeenCalled();
  });

  it('surfaces a fetch error', async () => {
    getEmployerCastingCheckoutSummaryMock.mockRejectedValue(new Error('network error'));

    const { result } = renderHook(() => useEmployerCastingCheckoutSummary('casting-1'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
  });
});
