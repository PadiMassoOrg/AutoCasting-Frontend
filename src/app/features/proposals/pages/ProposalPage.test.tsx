import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ROUTES } from '../../../shared/lib/routes';
import { readPendingProposal, savePendingProposal } from '../utils/pendingProposal';
import ProposalPage from './ProposalPage';

const logoutInPlaceMock = vi.fn();
const usePublicProposalMock = vi.fn();
const navigateMock = vi.fn();
let authToken: string | null = null;

const requirement = { code: 'EMPLOYER_ONBOARDING_COMPLETED', requiredMode: 'EMPLOYER' } as const;
const loadedProposal = {
  data: { typeCode: 'sitemetadata.proposal_type.casting', requirement, preview: {} },
  error: null,
  isLoading: false,
};

vi.mock('autocasting-ui-library-padimasso', () => ({
  Label: ({ children }: { children: ReactNode }) => <label>{children}</label>,
}));
vi.mock('../../auth/hooks/useAuthToken', () => ({ useAuthToken: () => authToken }));
vi.mock('../../auth/services/authService', () => ({ logoutInPlace: () => logoutInPlaceMock() }));
vi.mock('../hooks/usePublicProposal', () => ({
  usePublicProposal: (...args: unknown[]) => usePublicProposalMock(...args),
}));
vi.mock('../components/casting/CastingProposalPreview', () => ({
  default: ({ onClaim }: { onClaim: () => void }) => <button onClick={onClaim}>claim</button>,
}));
vi.mock('../../../context/ToastContext', () => ({ useToast: () => ({ showToast: vi.fn() }) }));
vi.mock('../../../shared/components/ErrorPage', () => ({ ServerErrorPage: () => null }));
vi.mock('react-router-dom', () => ({ useNavigate: () => navigateMock, useParams: () => ({ token: 'token-1' }) }));
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

describe('ProposalPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    logoutInPlaceMock.mockReset();
    navigateMock.mockReset();
    usePublicProposalMock.mockReset().mockReturnValue({ data: undefined, error: null, isLoading: true });
  });

  it('keeps an active session while showing the proposal', () => {
    authToken = 'jwt';
    usePublicProposalMock.mockReturnValue(loadedProposal);

    render(<ProposalPage />);

    expect(logoutInPlaceMock).not.toHaveBeenCalled();
    expect(usePublicProposalMock).toHaveBeenCalledWith('token-1');
    expect(screen.getByText('claim')).toBeTruthy();
  });

  it('discards a pending proposal left over from another link', () => {
    authToken = null;
    savePendingProposal({ token: 'old-token', typeCode: 'sitemetadata.proposal_type.casting', requirement });

    render(<ProposalPage />);

    expect(readPendingProposal()).toBeNull();
  });

  it('on claim, logs out the active session before saving the pending proposal', () => {
    authToken = 'jwt';
    usePublicProposalMock.mockReturnValue(loadedProposal);
    logoutInPlaceMock.mockImplementation(() => window.localStorage.clear());

    render(<ProposalPage />);
    fireEvent.click(screen.getByText('claim'));

    expect(logoutInPlaceMock).toHaveBeenCalledTimes(1);
    expect(readPendingProposal()?.token).toBe('token-1');
    expect(navigateMock).toHaveBeenCalledWith(ROUTES.AUTH_REGISTER);
  });

  it('on claim without a session, goes straight to authentication', () => {
    authToken = null;
    usePublicProposalMock.mockReturnValue(loadedProposal);

    render(<ProposalPage />);
    fireEvent.click(screen.getByText('claim'));

    expect(logoutInPlaceMock).not.toHaveBeenCalled();
    expect(readPendingProposal()?.token).toBe('token-1');
  });
});
