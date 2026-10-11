import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { EventCardResponse } from '../types/events.types';
import EventCard from './EventCard';

vi.mock('autocasting-ui-library-padimasso', () => ({
  Icon: () => null,
  SectionCard: ({ children }: { children: ReactNode }) => <section>{children}</section>,
  Separator: () => null,
  ThumbnailImage: ({ src, alt }: { src?: string | null; alt?: string }) => <img src={src ?? undefined} alt={alt} />,
}));

const item = (overrides: Partial<EventCardResponse> = {}): EventCardResponse => ({
  id: 'event-1',
  slug: 'E-1A2B3C4D',
  name: 'Muestra de teatro',
  startDate: '2026-10-12',
  endDate: '2026-10-14',
  datesInfo: 'Lun-Mar 20:30hs',
  location: 'Teatro del Abasto, Buenos Aires',
  imageUrl: 'https://img/event.jpeg',
  ...overrides,
});

describe('EventCard', () => {
  it('shows name and dates info', () => {
    const { container } = render(<EventCard item={item()} />);

    expect(container.textContent).toContain('Muestra de teatro');
    expect(container.textContent).toContain('Lun-Mar 20:30hs');
  });

  it('shows start and end dates', () => {
    const { container } = render(<EventCard item={item()} />);

    expect(container.textContent).toContain('12/10/2026 - 14/10/2026');
  });

  it('shows the location', () => {
    const { container } = render(<EventCard item={item()} />);

    expect(container.textContent).toContain('Teatro del Abasto, Buenos Aires');
  });

  it('shows the event image', () => {
    const { container } = render(<EventCard item={item()} />);

    expect(container.querySelector('img')?.getAttribute('src')).toBe('https://img/event.jpeg');
  });

  it('omits the dates info when missing', () => {
    const { container } = render(<EventCard item={item({ datesInfo: null })} />);

    expect(container.textContent).not.toContain('Lun-Mar 20:30hs');
    expect(container.textContent).toContain('Muestra de teatro');
  });
});
