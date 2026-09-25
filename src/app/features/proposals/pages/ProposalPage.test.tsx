import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { readPendingProposal, savePendingProposal } from '../utils/pendingProposal';
import ProposalPage from './ProposalPage';

const logoutInPlaceMock = vi.fn();
const usePublicProposalMock = vi.fn();
let authToken: string | null = null;

vi.mock('autocasting-ui-library-padimasso', () => ({
  Label: ({ children }: { children: ReactNode }) => <label>{children}</label>,
}));
vi.mock('../../auth/hooks/useAuthToken', () => ({ useAuthToken: () => authToken }));
vi.mock('../../auth/services/authService', () => ({ logoutInPlace: () => logoutInPlaceMock() }));
vi.mock('../hooks/usePublicProposal', () => ({
  usePublicProposal: (...args: unknown[]) => usePublicProposalMock(...args),
}));
vi.mock('../components/casting/CastingProposalPreview', () => ({ default: () => null }));
vi.mock('../../../context/ToastContext', () => ({ useToast: () => ({ showToast: vi.fn() }) }));
vi.mock('../../../shared/components/ErrorPage', () => ({ ServerErrorPage: () => null }));
vi.mock('react-router-dom', () => ({ useNavigate: () => vi.fn(), useParams: () => ({ token: 'token-1' }) }));
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

describe('ProposalPage', () => {
  beforeEach(() => {
    logoutInPlaceMock.mockReset();
    usePublicProposalMock.mockReset().mockReturnValue({ data: undefined, error: null, isLoading: true });
  });

  it('logs out an active session and waits before fetching the proposal', () => {
    authToken = 'jwt';

    render(<ProposalPage />);

    expect(logoutInPlaceMock).toHaveBeenCalledTimes(1);
    expect(usePublicProposalMock).toHaveBeenCalledWith('token-1', false);
  });

  it('discards a pending proposal left over from another link', () => {
    authToken = null;
    savePendingProposal({
      token: 'old-token',
      typeCode: 'sitemetadata.proposal_type.casting',
      requirement: { code: 'EMPLOYER_ONBOARDING_COMPLETED', requiredMode: 'EMPLOYER' },
    });

    render(<ProposalPage />);

    expect(readPendingProposal()).toBeNull();
  });

  it('fetches the proposal right away when nobody is logged in', () => {
    authToken = null;

    render(<ProposalPage />);

    expect(logoutInPlaceMock).not.toHaveBeenCalled();
    expect(usePublicProposalMock).toHaveBeenCalledWith('token-1', true);
  });
});
