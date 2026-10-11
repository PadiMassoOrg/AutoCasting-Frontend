import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useRouteTracking } from './routeTracking';

let mockLocation = { pathname: '/', search: '', hash: '' };
vi.mock('react-router-dom', () => ({ useLocation: () => mockLocation }));

const pageviews = () => (window.dataLayer ?? []).filter((e) => e.event === 'pageview').map((e) => e.page_path);

describe('useRouteTracking', () => {
  beforeEach(() => {
    window.dataLayer = [];
    window.fbq = undefined;
    mockLocation = { pathname: '/', search: '', hash: '' };
  });

  it('tracks a pageview per path change', () => {
    const { rerender } = renderHook(() => useRouteTracking());

    mockLocation = { pathname: '/casting-database', search: '', hash: '' };
    rerender();

    expect(pageviews()).toEqual(['/', '/casting-database']);
  });

  it('does not count opening or closing an event details overlay as a page change', () => {
    mockLocation = { pathname: '/events', search: '', hash: '' };
    const { rerender } = renderHook(() => useRouteTracking());

    mockLocation = { pathname: '/events/E-1A2B3C4D', search: '', hash: '' };
    rerender();
    mockLocation = { pathname: '/events', search: '', hash: '' };
    rerender();

    expect(pageviews()).toEqual(['/events']);
  });

  it('tracks a shared event link as the events page', () => {
    mockLocation = { pathname: '/events/E-1A2B3C4D', search: '', hash: '' };
    renderHook(() => useRouteTracking());

    expect(pageviews()).toEqual(['/events']);
  });
});
