import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { SiteMetadataObject } from '../../../../sitemetadata/types/sitemetadata.types';
import {
  CASTING_APPLICATION_STATUS_BLANK,
  CASTING_APPLICATION_STATUS_NOT_PROCEEDING,
  CASTING_APPLICATION_STATUS_PRESELECTED,
  CASTING_APPLICATION_STATUS_SELECTED,
  CASTING_APPLICATION_STATUS_VIEWED,
} from '../../../../sitemetadata/utils/siteMetadataUtils';
import { useCastingApplicationStatusActions } from './useCastingApplicationStatusActions';

/**
 * Applicant status changes are intentionally unconstrained (decided under AI-34, documented in
 * Confluence "Applicant Status Changes"): unlike casting status, there is no transition policy
 * here or on the backend — any status can move to any other status, individually or in bulk.
 * These tests lock that decision in place on the frontend side (mirroring the backend's
 * CastingApplicationServiceImplStatusTransitionTest) so a restriction isn't silently introduced
 * here later without a corresponding product decision and documentation update.
 */

const preselectApplicationMock = vi.fn();
const selectApplicationMock = vi.fn();
const viewApplicationMock = vi.fn();
const notProceedingApplicationMock = vi.fn();
const blankApplicationMock = vi.fn();
const bulkSetApplicationsStatusMock = vi.fn();

vi.mock('../../services/employerCastingApplicantsService', () => ({
  EMPLOYER_CASTING_APPLICANTS_CACHE_KEY: ['employer-cache-casting-applicants'],
  preselectApplication: (...args: unknown[]) => preselectApplicationMock(...args),
  selectApplication: (...args: unknown[]) => selectApplicationMock(...args),
  viewApplication: (...args: unknown[]) => viewApplicationMock(...args),
  notProceedingApplication: (...args: unknown[]) => notProceedingApplicationMock(...args),
  blankApplication: (...args: unknown[]) => blankApplicationMock(...args),
  bulkSetApplicationsStatus: (...args: unknown[]) => bulkSetApplicationsStatusMock(...args),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('../../../../../context/ToastContext', () => ({
  useToast: () => ({ showToast: vi.fn() }),
}));

const wrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

const ALL_STATUSES: SiteMetadataObject[] = [
  { id: 'status-blank', stringCode: CASTING_APPLICATION_STATUS_BLANK },
  { id: 'status-viewed', stringCode: CASTING_APPLICATION_STATUS_VIEWED },
  { id: 'status-preselected', stringCode: CASTING_APPLICATION_STATUS_PRESELECTED },
  { id: 'status-selected', stringCode: CASTING_APPLICATION_STATUS_SELECTED },
  { id: 'status-not-proceeding', stringCode: CASTING_APPLICATION_STATUS_NOT_PROCEEDING },
];

const params = { applicationId: 'application-1', castingSlug: 'C-ABCDEF12' };

describe('useCastingApplicationStatusActions', () => {
  beforeEach(() => {
    preselectApplicationMock.mockReset().mockResolvedValue({});
    selectApplicationMock.mockReset().mockResolvedValue({});
    viewApplicationMock.mockReset().mockResolvedValue({});
    notProceedingApplicationMock.mockReset().mockResolvedValue({});
    blankApplicationMock.mockReset().mockResolvedValue({});
    bulkSetApplicationsStatusMock.mockReset().mockResolvedValue({});
  });

  it.each(ALL_STATUSES)('setStatus succeeds for target status $stringCode with no transition check', async (status) => {
    const { result } = renderHook(() => useCastingApplicationStatusActions(), { wrapper });

    await act(async () => {
      await result.current.setStatus(status, params);
    });

    const mocksByCode: Record<string, ReturnType<typeof vi.fn>> = {
      [CASTING_APPLICATION_STATUS_PRESELECTED]: preselectApplicationMock,
      [CASTING_APPLICATION_STATUS_SELECTED]: selectApplicationMock,
      [CASTING_APPLICATION_STATUS_VIEWED]: viewApplicationMock,
      [CASTING_APPLICATION_STATUS_NOT_PROCEEDING]: notProceedingApplicationMock,
      [CASTING_APPLICATION_STATUS_BLANK]: blankApplicationMock,
    };

    expect(mocksByCode[status.stringCode]).toHaveBeenCalledWith({ applicationId: params.applicationId });
  });

  it('allows moving directly from Not Proceeding back to Preselected (a reversal a transition policy would typically forbid)', async () => {
    const { result } = renderHook(() => useCastingApplicationStatusActions(), { wrapper });

    await act(async () => {
      await result.current.setStatus({ id: 'x', stringCode: CASTING_APPLICATION_STATUS_NOT_PROCEEDING }, params);
      await result.current.setStatus({ id: 'y', stringCode: CASTING_APPLICATION_STATUS_PRESELECTED }, params);
    });

    expect(notProceedingApplicationMock).toHaveBeenCalledTimes(1);
    expect(preselectApplicationMock).toHaveBeenCalledTimes(1);
  });

  it('allows moving directly from Viewed to Selected, skipping Preselected', async () => {
    const { result } = renderHook(() => useCastingApplicationStatusActions(), { wrapper });

    await act(async () => {
      await result.current.setStatus({ id: 'x', stringCode: CASTING_APPLICATION_STATUS_VIEWED }, params);
      await result.current.setStatus({ id: 'y', stringCode: CASTING_APPLICATION_STATUS_SELECTED }, params);
    });

    expect(viewApplicationMock).toHaveBeenCalledTimes(1);
    expect(selectApplicationMock).toHaveBeenCalledTimes(1);
  });

  it.each(ALL_STATUSES)(
    'bulkSetStatusByCode succeeds for target status $stringCode regardless of current statuses',
    async (status) => {
      const { result } = renderHook(() => useCastingApplicationStatusActions(), { wrapper });
      const bulkParams = { applicationIds: ['app-1', 'app-2', 'app-3'], castingSlug: params.castingSlug };

      await act(async () => {
        await result.current.bulkSetStatusByCode(status.stringCode, bulkParams);
      });

      expect(bulkSetApplicationsStatusMock).toHaveBeenCalledWith({
        applicationIds: bulkParams.applicationIds,
        applicationStatus: status.stringCode,
      });
    }
  );

  it('bulkSetStatusByCode does nothing for an unrecognized status code', async () => {
    const { result } = renderHook(() => useCastingApplicationStatusActions(), { wrapper });

    await act(async () => {
      await result.current.bulkSetStatusByCode('sitemetadata.application_status.unknown', {
        applicationIds: ['app-1'],
        castingSlug: params.castingSlug,
      });
    });

    expect(bulkSetApplicationsStatusMock).not.toHaveBeenCalled();
  });
});
