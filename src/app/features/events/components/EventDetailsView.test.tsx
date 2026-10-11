import { fireEvent, render } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { formatLocalDate } from '../../../shared/utils/formatUtils';
import type { EventDetailsResponse } from '../types/events.types';
import EventDetailsView from './EventDetailsView';

vi.mock('autocasting-ui-library-padimasso', () => ({
  ButtonRow: ({ items }: { items: ReactNode[] }) => <div>{items}</div>,
  Icon: ({ name, onClick }: { name: string; onClick?: () => void }) => (
    <button type="button" aria-label={name} onClick={onClick} />
  ),
  showToast: vi.fn(),
  Button: ({ children, asChild, disabled }: { children: ReactNode; asChild?: boolean; disabled?: boolean }) =>
    asChild ? <>{children}</> : <button disabled={disabled}>{children}</button>,
  DetailsView: ({
    open,
    headerLeft,
    bottomBar,
    children,
  }: {
    open: boolean;
    headerLeft: ReactNode;
    bottomBar?: ReactNode;
    children?: ReactNode;
  }) =>
    open ? (
      <div>
        <header>{headerLeft}</header>
        <main>{children}</main>
        <footer>{bottomBar}</footer>
      </div>
    ) : null,
  ThumbnailImage: ({ src, alt }: { src?: string | null; alt?: string }) => <img src={src ?? undefined} alt={alt} />,
}));
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

const mockShareUrl = vi.fn();
vi.mock('../../../shared/utils/shareUtils', () => ({ shareUrl: (params: unknown) => mockShareUrl(params) }));

const mockUseDetailsLoadError = vi.fn();
vi.mock('../../../shared/hooks/useDetailsLoadError', () => ({
  useDetailsLoadError: (args: unknown) => mockUseDetailsLoadError(args),
}));

const mockUseEventDetails = vi.fn();
vi.mock('../hooks/useEventDetails', () => ({ useEventDetails: (slug?: string | null) => mockUseEventDetails(slug) }));

const FREE = { id: 'ea-free', stringCode: 'sitemetadata.entry_access.free' };
const PAY_AT_DOOR = { id: 'ea-door', stringCode: 'sitemetadata.entry_access.pay_at_door' };
const ONLINE = { id: 'ea-online', stringCode: 'sitemetadata.entry_access.online' };

const event = (overrides: Partial<EventDetailsResponse> = {}): EventDetailsResponse => ({
  id: 'event-1',
  slug: 'E-1A2B3C4D',
  name: 'La Casa de Bernarda Alba',
  entryAccess: FREE,
  ticketUrl: null,
  startDate: '2026-10-12',
  endDate: '2026-10-14',
  datesInfo: 'Lunes y Martes 20:30hs',
  location: 'Teatro San Martín, CABA',
  imageUrl: 'https://img/event.jpeg',
  description: 'Una obra clásica.',
  ...overrides,
});

const onClose = vi.fn();

const renderWith = (data: EventDetailsResponse | undefined, extra: Record<string, unknown> = {}) => {
  mockUseEventDetails.mockReturnValue({ data, error: null, isLoading: false, ...extra });
  return render(<EventDetailsView open onClose={onClose} slug="E-1A2B3C4D" />);
};

describe('EventDetailsView', () => {
  beforeEach(() => {
    mockUseEventDetails.mockReset();
    mockShareUrl.mockReset();
    mockUseDetailsLoadError.mockReset();
    mockUseDetailsLoadError.mockReturnValue(false);
    onClose.mockReset();
  });

  it('renders nothing when closed', () => {
    mockUseEventDetails.mockReturnValue({ data: event(), error: null, isLoading: false });

    const { container } = render(<EventDetailsView open={false} onClose={vi.fn()} slug="E-1A2B3C4D" />);

    expect(container.innerHTML).toBe('');
  });

  it('fetches the event by the slug it receives', () => {
    renderWith(event());

    expect(mockUseEventDetails).toHaveBeenCalledWith('E-1A2B3C4D');
  });

  it('shows the event data', () => {
    const { container } = renderWith(event());
    const text = container.textContent ?? '';

    expect(text).toContain('La Casa de Bernarda Alba');
    expect(text).toContain(
      `${formatLocalDate('2026-10-12', 'dayMonth')} - ${formatLocalDate('2026-10-14', 'dayMonth')}`
    );
    expect(text).toContain('Lunes y Martes 20:30hs');
    expect(text).toContain('Teatro San Martín, CABA');
    expect(text).toContain('Una obra clásica.');
    expect(container.querySelector('img')?.getAttribute('src')).toBe('https://img/event.jpeg');
  });

  it('omits the schedule and description sections when they are empty', () => {
    const { container } = renderWith(event({ datesInfo: null, description: null }));
    const text = container.textContent ?? '';

    expect(text).not.toContain('events.details.schedule');
    expect(text).not.toContain('events.details.description');
    expect(text).toContain('events.details.location');
  });

  it('links to the ticket page in a new tab for ONLINE access', () => {
    const { container } = renderWith(event({ entryAccess: ONLINE, ticketUrl: 'https://example.com/tickets/1' }));
    const link = container.querySelector('footer a');

    expect(link?.getAttribute('href')).toBe('https://example.com/tickets/1');
    expect(link?.getAttribute('target')).toBe('_blank');
    expect(link?.getAttribute('rel')).toContain('noopener');
    expect(link?.textContent).toBe('events.details.buy_ticket');
    expect(container.querySelector('footer button')).toBeNull();
  });

  it('shows a disabled button for PAY_AT_DOOR access', () => {
    const { container } = renderWith(event({ entryAccess: PAY_AT_DOOR }));
    const button = container.querySelector('footer button') as HTMLButtonElement;

    expect(button.disabled).toBe(true);
    expect(button.textContent).toBe('sitemetadata.entry_access.pay_at_door');
    expect(container.querySelector('footer a')).toBeNull();
  });

  it('shows a disabled button for FREE access', () => {
    const { container } = renderWith(event({ entryAccess: FREE }));
    const button = container.querySelector('footer button') as HTMLButtonElement;

    expect(button.disabled).toBe(true);
    expect(button.textContent).toBe('sitemetadata.entry_access.free');
  });

  it('disables the ONLINE button when the ticket url is unusable', () => {
    const { container } = renderWith(event({ entryAccess: ONLINE, ticketUrl: 'not a url' }));
    const button = container.querySelector('footer button') as HTMLButtonElement;

    expect(button.disabled).toBe(true);
    expect(button.textContent).toBe('events.details.buy_ticket');
    expect(container.querySelector('footer a')).toBeNull();
  });

  it('labels a future non-online entry access with its own sitemetadata label', () => {
    const { container } = renderWith(
      event({ entryAccess: { id: 'ea-new', stringCode: 'sitemetadata.entry_access.invitation_only' } })
    );
    const button = container.querySelector('footer button') as HTMLButtonElement;

    expect(button.disabled).toBe(true);
    expect(button.textContent).toBe('sitemetadata.entry_access.invitation_only');
  });

  it('copies the shareable event link', () => {
    const { container } = renderWith(event());

    fireEvent.click(container.querySelector('button[aria-label="copyLink"]')!);

    expect(mockShareUrl).toHaveBeenCalledWith(
      expect.objectContaining({ url: `${window.location.origin}/events/E-1A2B3C4D` })
    );
  });

  it('does not offer the copy link while there is no event', () => {
    const { container } = renderWith(undefined, { error: new Error('boom') });

    expect(container.querySelector('button[aria-label="copyLink"]')).toBeNull();
  });

  it('lets the shared details load-error handling report a failure, closing through onClose', () => {
    const error = new Error('boom');

    renderWith(undefined, { error });

    expect(mockUseDetailsLoadError).toHaveBeenCalledWith({
      error,
      unavailableMessageKey: 'events.unavailable',
      onFail: onClose,
    });
  });

  it('renders nothing while the load error is being handled', () => {
    mockUseDetailsLoadError.mockReturnValue(true);

    const { container } = renderWith(undefined, { error: new Error('boom') });

    expect(container.innerHTML).toBe('');
  });
});
