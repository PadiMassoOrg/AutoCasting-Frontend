import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import ScrollToTopOnRouteChange from './ScrollToTopOnRouteChange';

vi.mock('autocasting-ui-library-padimasso', () => ({
  ScrollToTop: ({ watch }: { watch: string }) => <span data-testid="watch">{watch}</span>,
}));

const watchFor = (path: string) => {
  const { getByTestId } = render(
    <MemoryRouter initialEntries={[path]}>
      <ScrollToTopOnRouteChange />
    </MemoryRouter>
  );
  return getByTestId('watch').textContent;
};

describe('ScrollToTopOnRouteChange', () => {
  it('treats an event details path as the events list', () => {
    expect(watchFor('/events/E-1A2B3C4D')).toBe('/events');
  });

  it('keeps the events list path as is', () => {
    expect(watchFor('/events')).toBe('/events');
  });

  it('does not touch other paths', () => {
    expect(watchFor('/casting-database')).toBe('/casting-database');
  });

  it('still tracks the main-site view param presence', () => {
    expect(watchFor('/?view=talent')).toBe('/?view=_');
  });
});
