import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { useEventDetailsRoute } from './useEventDetailsRoute';

const wrapperFor = (initialEntries: string[]) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/events/:slug?" element={<>{children}</>} />
          <Route path="/other" element={<>{children}</>} />
        </Routes>
      </MemoryRouter>
    );
  };

const renderRoute = (initialEntries: string[]) =>
  renderHook(() => ({ route: useEventDetailsRoute(), location: useLocation(), navigate: useNavigate() }), {
    wrapper: wrapperFor(initialEntries),
  });

describe('useEventDetailsRoute', () => {
  it('exposes the slug from the URL', () => {
    const { result } = renderRoute(['/events/E-1A2B3C4D']);

    expect(result.current.route.slug).toBe('E-1A2B3C4D');
  });

  it('has no slug on the list', () => {
    const { result } = renderRoute(['/events']);

    expect(result.current.route.slug).toBeUndefined();
  });

  it('opens an event by pushing its URL', () => {
    const { result } = renderRoute(['/events']);

    act(() => result.current.route.openEvent('E-1A2B3C4D'));

    expect(result.current.location.pathname).toBe('/events/E-1A2B3C4D');
    expect(result.current.route.slug).toBe('E-1A2B3C4D');
  });

  it('steps back when closing an event opened from the list, so Back does not reopen it', () => {
    const { result } = renderRoute(['/other', '/events']);

    act(() => result.current.route.openEvent('E-1A2B3C4D'));
    act(() => result.current.route.closeEvent());
    expect(result.current.location.pathname).toBe('/events');

    act(() => result.current.navigate(-1));
    expect(result.current.location.pathname).toBe('/other');
  });

  it('replaces the entry when closing an event reached from a shared link', () => {
    const { result } = renderRoute(['/other', '/events/E-1A2B3C4D']);

    act(() => result.current.route.closeEvent());
    expect(result.current.location.pathname).toBe('/events');

    act(() => result.current.navigate(-1));
    expect(result.current.location.pathname).toBe('/other');
  });
});
