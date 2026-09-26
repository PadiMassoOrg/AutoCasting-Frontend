import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { savePendingProposal, readPendingProposal } from '../utils/pendingProposal';
import { usePendingProposal } from './usePendingProposal';

const attachProposalMock = vi.fn();
const claimOrGetClaimResultMock = vi.fn();
const navigateMock = vi.fn();
const showToastMock = vi.fn();
let authToken: string | null = 'jwt';
let meData: Record<string, unknown> | undefined;
let sessionFromOtherTab = false;

vi.mock('../services/proposalsService', () => ({
  attachProposal: (...args: unknown[]) => attachProposalMock(...args),
  claimOrGetClaimResult: (...args: unknown[]) => claimOrGetClaimResultMock(...args),
}));
vi.mock('../../auth/hooks/useAuthToken', () => ({ useAuthToken: () => authToken }));
vi.mock('../../auth/hooks/useMeData', () => ({ useMeData: () => ({ data: meData }) }));
vi.mock('../../auth/hooks/useSessionFromOtherTab', () => ({ useSessionFromOtherTab: () => sessionFromOtherTab }));
vi.mock('../../auth/services/authService', () => ({ ME_DATA_CACHE_KEY: ['cache-me-data'] }));
vi.mock('../components/casting/CastingProposalPreview', () => ({ default: () => null }));
vi.mock('../../../context/ToastContext', () => ({ useToast: () => ({ showToast: showToastMock }) }));
let pathname = '/dashboard';
vi.mock('react-router-dom', () => ({ useNavigate: () => navigateMock, useLocation: () => ({ pathname }) }));
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

const wrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

const savePending = () =>
  savePendingProposal({
    token: 'token-1',
    typeCode: 'sitemetadata.proposal_type.casting',
    requirement: { code: 'EMPLOYER_ONBOARDING_COMPLETED', requiredMode: 'EMPLOYER' },
  });

const gone = { response: { status: 410, data: { status: 410 } } };

describe('usePendingProposal', () => {
  beforeEach(() => {
    window.localStorage.clear();
    attachProposalMock.mockReset().mockResolvedValue(undefined);
    claimOrGetClaimResultMock.mockReset();
    navigateMock.mockReset();
    showToastMock.mockReset();
    authToken = 'jwt';
    sessionFromOtherTab = false;
    pathname = '/dashboard';
    meData = { activeMode: null, employerOnboardingStatus: 'NOT_STARTED', talentOnboardingStatus: 'NOT_STARTED' };
  });

  it('does nothing without a pending proposal', () => {
    renderHook(() => usePendingProposal(), { wrapper });

    expect(attachProposalMock).not.toHaveBeenCalled();
    expect(claimOrGetClaimResultMock).not.toHaveBeenCalled();
  });

  it('does nothing while logged out', () => {
    authToken = null;
    savePending();

    renderHook(() => usePendingProposal(), { wrapper });

    expect(attachProposalMock).not.toHaveBeenCalled();
  });

  it('stays idle in a tab that received another tab’s login', () => {
    sessionFromOtherTab = true;
    meData = { ...meData, employerOnboardingStatus: 'COMPLETED' };
    savePending();

    renderHook(() => usePendingProposal(), { wrapper });

    expect(attachProposalMock).not.toHaveBeenCalled();
    expect(claimOrGetClaimResultMock).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it('stays idle on a proposal link page', () => {
    pathname = '/proposal/new-token';
    meData = { ...meData, employerOnboardingStatus: 'COMPLETED' };
    savePending();

    renderHook(() => usePendingProposal(), { wrapper });

    expect(claimOrGetClaimResultMock).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it('attaches when the requirement is not met yet and keeps the pending token', async () => {
    savePending();

    renderHook(() => usePendingProposal(), { wrapper });

    await waitFor(() => expect(attachProposalMock).toHaveBeenCalledWith('token-1'));
    expect(claimOrGetClaimResultMock).not.toHaveBeenCalled();
    expect(readPendingProposal()?.token).toBe('token-1');
  });

  it('claims when the requirement is met, then redirects, toasts and clears the token', async () => {
    meData = { ...meData, employerOnboardingStatus: 'COMPLETED' };
    savePending();
    claimOrGetClaimResultMock.mockResolvedValue({
      typeCode: 'sitemetadata.proposal_type.casting',
      associated: [{ entityType: 'CASTING', id: 'id', slug: 'C-TEST0001' }],
      outcome: { published: true },
    });

    renderHook(() => usePendingProposal(), { wrapper });

    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/dashboard/employer/castings', { replace: true }));
    expect(showToastMock).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' }));
    expect(readPendingProposal()).toBeNull();
    expect(attachProposalMock).not.toHaveBeenCalled();
  });

  it('sends the user home with a toast when the link is no longer valid', async () => {
    meData = { ...meData, employerOnboardingStatus: 'COMPLETED' };
    savePending();
    claimOrGetClaimResultMock.mockRejectedValue(gone);

    renderHook(() => usePendingProposal(), { wrapper });

    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/talent-database', { replace: true }));
    expect(showToastMock).toHaveBeenCalledWith(expect.objectContaining({ description: 'proposals.link_invalid' }));
    expect(readPendingProposal()).toBeNull();
  });
});
