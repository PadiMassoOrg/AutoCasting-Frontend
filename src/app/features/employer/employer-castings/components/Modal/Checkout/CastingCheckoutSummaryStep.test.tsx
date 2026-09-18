import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { EmployerCastingCheckoutSummaryResponse } from '../../../types/employerCastings.types';
import { CastingCheckoutSummaryStep } from './CastingCheckoutSummaryStep';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('autocasting-ui-library-padimasso', () => ({
  Button: ({ children, onClick, loading }: { children: React.ReactNode; onClick?: () => void; loading?: boolean }) => (
    <button onClick={onClick} disabled={loading}>
      {children}
    </button>
  ),
  Separator: () => <hr />,
  WizardActions: ({
    primaryAction,
    secondaryAction,
  }: {
    primaryAction: React.ReactNode;
    secondaryAction: React.ReactNode;
  }) => (
    <div>
      {secondaryAction}
      {primaryAction}
    </div>
  ),
  WizardBody: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  WizardFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  WizardLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const summaryFixture: EmployerCastingCheckoutSummaryResponse = {
  id: 'casting-1',
  defaultCode: 'C-ABCDEF12',
  castingTitle: 'Feature Film Lead',
  projectType: { id: 'pt-1', stringCode: 'sitemetadata.project_type.film' },
  castingModality: { id: 'cm-1', stringCode: 'sitemetadata.casting_modality.on_site' },
  applicationDeadline: '2026-12-31',
  roles: [
    {
      id: 'role-1',
      roleName: 'Lead',
      roleType: { id: 'rt-1', stringCode: 'sitemetadata.role_type.protagonist' },
      payRateType: null,
      currency: null,
      amount: null,
    },
  ],
};

describe('CastingCheckoutSummaryStep', () => {
  it('renders the casting title, project type, modality, deadline and roles', () => {
    render(
      <CastingCheckoutSummaryStep summary={summaryFixture} onClose={vi.fn()} onPublish={vi.fn()} isPublishing={false} />
    );

    expect(screen.getByText('Feature Film Lead')).toBeTruthy();
    expect(screen.getByText('sitemetadata.project_type.film')).toBeTruthy();
    expect(screen.getByText('sitemetadata.casting_modality.on_site')).toBeTruthy();
    expect(screen.getByText('Lead')).toBeTruthy();
    expect(screen.getByText('sitemetadata.role_type.protagonist')).toBeTruthy();
  });

  it('renders placeholders for missing title, project type and modality', () => {
    render(
      <CastingCheckoutSummaryStep
        summary={{ ...summaryFixture, castingTitle: null, projectType: null, castingModality: null }}
        onClose={vi.fn()}
        onPublish={vi.fn()}
        isPublishing={false}
      />
    );

    const dashes = screen.getAllByText('-');
    expect(dashes.length).toBeGreaterThanOrEqual(2);
  });

  it('calls onClose when the cancel button is clicked', () => {
    const onClose = vi.fn();

    render(
      <CastingCheckoutSummaryStep summary={summaryFixture} onClose={onClose} onPublish={vi.fn()} isPublishing={false} />
    );

    fireEvent.click(screen.getByText('general.cancel'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onPublish when the publish button is clicked', () => {
    const onPublish = vi.fn().mockResolvedValue(undefined);

    render(
      <CastingCheckoutSummaryStep
        summary={summaryFixture}
        onClose={vi.fn()}
        onPublish={onPublish}
        isPublishing={false}
      />
    );

    fireEvent.click(screen.getByText('employer_castings.dashboard.checkout.checkout_and_publish'));

    expect(onPublish).toHaveBeenCalledTimes(1);
  });

  it('disables the publish button while isPublishing is true', () => {
    render(
      <CastingCheckoutSummaryStep summary={summaryFixture} onClose={vi.fn()} onPublish={vi.fn()} isPublishing={true} />
    );

    const publishButton = screen.getByText(
      'employer_castings.dashboard.checkout.checkout_and_publish'
    ) as HTMLButtonElement;

    expect(publishButton.disabled).toBe(true);
  });
});
