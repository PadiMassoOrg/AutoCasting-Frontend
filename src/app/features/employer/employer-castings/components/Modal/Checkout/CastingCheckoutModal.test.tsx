import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { EmployerCastingCheckoutSummaryResponse } from '../../../types/employerCastings.types';
import CastingCheckoutModal from './CastingCheckoutModal';

const useEmployerCastingCheckoutSummaryMock = vi.fn();
const useCastingStatusMutationMock = vi.fn();

vi.mock('../../../hooks/useEmployerCastingCheckoutSummary', () => ({
  useEmployerCastingCheckoutSummary: (...args: unknown[]) => useEmployerCastingCheckoutSummaryMock(...args),
}));

vi.mock('../../../hooks/status/useCastingStatusMutation', () => ({
  useCastingStatusMutation: (...args: unknown[]) => useCastingStatusMutationMock(...args),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('../../../../../../shared/components/ErrorPage', () => ({
  ServerErrorPage: () => <div>server-error-page</div>,
}));

vi.mock('autocasting-ui-library-padimasso', () => ({
  Wizard: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
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
  projectType: null,
  castingModality: null,
  applicationDeadline: null,
  roles: [],
};

describe('CastingCheckoutModal', () => {
  beforeEach(() => {
    useEmployerCastingCheckoutSummaryMock.mockReset();
    useCastingStatusMutationMock.mockReset();
    useCastingStatusMutationMock.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(undefined),
      isPending: false,
    });
  });

  it('shows a loading state while the summary is being fetched', () => {
    useEmployerCastingCheckoutSummaryMock.mockReturnValue({ data: undefined, isLoading: true, error: null });

    render(<CastingCheckoutModal castingId="casting-1" slug="my-slug" onClose={vi.fn()} />);

    expect(screen.getByText('Loading...')).toBeTruthy();
  });

  it('shows an error state when the fetch fails', () => {
    useEmployerCastingCheckoutSummaryMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('failed'),
    });

    render(<CastingCheckoutModal castingId="casting-1" slug="my-slug" onClose={vi.fn()} />);

    expect(screen.getByText('server-error-page')).toBeTruthy();
  });

  it('shows an error state when there is no error but also no data', () => {
    useEmployerCastingCheckoutSummaryMock.mockReturnValue({ data: undefined, isLoading: false, error: null });

    render(<CastingCheckoutModal castingId="casting-1" slug="my-slug" onClose={vi.fn()} />);

    expect(screen.getByText('server-error-page')).toBeTruthy();
  });

  it('renders the checkout summary once data has loaded', () => {
    useEmployerCastingCheckoutSummaryMock.mockReturnValue({ data: summaryFixture, isLoading: false, error: null });

    render(<CastingCheckoutModal castingId="casting-1" slug="my-slug" onClose={vi.fn()} />);

    expect(screen.getByText('Feature Film Lead')).toBeTruthy();
  });

  it('publishing delegates to useCastingStatusMutation("publish") with the casting id and slug, then closes on success', async () => {
    const mutateAsync = vi.fn().mockResolvedValue(undefined);
    useCastingStatusMutationMock.mockReturnValue({ mutateAsync, isPending: false });
    useEmployerCastingCheckoutSummaryMock.mockReturnValue({ data: summaryFixture, isLoading: false, error: null });

    const onClose = vi.fn();
    render(<CastingCheckoutModal castingId="casting-1" slug="my-slug" onClose={onClose} />);

    fireEvent.click(screen.getByText('employer_castings.dashboard.checkout.checkout_and_publish'));

    expect(useCastingStatusMutationMock).toHaveBeenCalledWith('publish');
    await vi.waitFor(() => expect(mutateAsync).toHaveBeenCalledWith({ id: 'casting-1', slug: 'my-slug' }));
    await vi.waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });

  it('publish failure surfaces without silently closing the modal', async () => {
    // KNOWN GAP (found while writing this test, not fixed here per AI-32's test-only scope):
    // CastingCheckoutModal's handlePublish has no try/catch around
    // `await publishMutation.mutateAsync(...)`, and the summary step calls it as
    // `void onPublish()` (fire-and-forget). So a publish failure propagates as an unhandled
    // promise rejection instead of a caught, contained error — the mutation's own `onError`
    // (in useCastingStatusMutation) still fires a toast, so the user isn't left with zero
    // feedback, but the modal component itself does nothing to catch the failure. That
    // unhandled rejection is expected here; it's suppressed for the duration of this test only
    // so it doesn't fail the wider test run, while still asserting the modal does NOT close.
    const mutateAsync = vi.fn().mockRejectedValue(new Error('publish failed'));
    useCastingStatusMutationMock.mockReturnValue({ mutateAsync, isPending: false });
    useEmployerCastingCheckoutSummaryMock.mockReturnValue({ data: summaryFixture, isLoading: false, error: null });

    const onClose = vi.fn();
    const swallowExpectedRejection = (reason: unknown) => {
      if (!(reason instanceof Error) || reason.message !== 'publish failed') throw reason;
    };
    process.on('unhandledRejection', swallowExpectedRejection);

    try {
      render(<CastingCheckoutModal castingId="casting-1" slug="my-slug" onClose={onClose} />);

      fireEvent.click(screen.getByText('employer_castings.dashboard.checkout.checkout_and_publish'));

      await vi.waitFor(() => expect(mutateAsync).toHaveBeenCalledTimes(1));
      // Give the rejected promise a tick to propagate before asserting.
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(onClose).not.toHaveBeenCalled();
    } finally {
      process.off('unhandledRejection', swallowExpectedRejection);
    }
  });

  it('reflects isPending from the publish mutation as isPublishing on the summary step', () => {
    useCastingStatusMutationMock.mockReturnValue({ mutateAsync: vi.fn(), isPending: true });
    useEmployerCastingCheckoutSummaryMock.mockReturnValue({ data: summaryFixture, isLoading: false, error: null });

    render(<CastingCheckoutModal castingId="casting-1" slug="my-slug" onClose={vi.fn()} />);

    const publishButton = screen.getByText(
      'employer_castings.dashboard.checkout.checkout_and_publish'
    ) as HTMLButtonElement;

    expect(publishButton.disabled).toBe(true);
  });
});
