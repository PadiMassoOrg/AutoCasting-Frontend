import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { savePendingProposal } from '../../proposals/utils/pendingProposal';
import OnboardingWizard from './OnboardingWizard';

vi.mock('autocasting-ui-library-padimasso', () => ({
  Wizard: ({ children }: { children: ReactNode[] | ReactNode }) => (
    <div>{Array.isArray(children) ? children[0] : children}</div>
  ),
}));
vi.mock('../../auth/hooks/useMeData', () => ({
  useMeData: () => ({ data: { activeMode: null }, isLoading: false }),
}));
vi.mock('./ModeSelectorStep', () => ({ default: () => <div>mode-selector</div> }));
vi.mock('./talent', () => ({
  TalentBasicInfoStep: () => <div>talent-basic-info</div>,
  TalentMediaStep: () => null,
  TalentConfirmationStep: () => null,
}));
vi.mock('./employer', () => ({
  EmployerBasicInfoStep: ({ onBackToModeSelector }: { onBackToModeSelector?: () => void }) => (
    <div>
      employer-basic-info
      {onBackToModeSelector && <span>back-to-mode-selector</span>}
    </div>
  ),
  EmployerMediaStep: () => null,
  EmployerConfirmationStep: () => null,
}));

describe('OnboardingWizard', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('starts at the mode selector without a pending proposal', () => {
    render(<OnboardingWizard />);

    expect(screen.getByText('mode-selector')).toBeTruthy();
  });

  it('starts in the flow the pending proposal requires, without going back to the mode selector', () => {
    savePendingProposal({
      token: 'token-1',
      typeCode: 'sitemetadata.proposal_type.casting',
      requirement: { code: 'EMPLOYER_ONBOARDING_COMPLETED', requiredMode: 'EMPLOYER' },
    });

    render(<OnboardingWizard />);

    expect(screen.queryByText('mode-selector')).toBeNull();
    expect(screen.getByText('employer-basic-info')).toBeTruthy();
    expect(screen.queryByText('back-to-mode-selector')).toBeNull();
  });
});
