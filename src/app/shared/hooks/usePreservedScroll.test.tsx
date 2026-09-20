import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { usePreservedScroll } from './usePreservedScroll';

describe('usePreservedScroll', () => {
  let scrollToMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    scrollToMock = vi.fn();
    vi.stubGlobal('scrollTo', scrollToMock);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  function setScrollY(value: number) {
    Object.defineProperty(window, 'scrollY', { value, configurable: true });
  }

  it('does not restore scroll before restoreWhen becomes true', () => {
    setScrollY(400);
    const { result } = renderHook(({ open }) => usePreservedScroll(open), { initialProps: { open: false } });

    act(() => {
      result.current.captureScroll();
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(scrollToMock).not.toHaveBeenCalled();
  });

  it('restores the scroll position captured before restoreWhen flips to true', () => {
    setScrollY(732);
    const { result, rerender } = renderHook(({ open }) => usePreservedScroll(open), {
      initialProps: { open: false },
    });

    // Simulate the real usage: capture right before opening, e.g. inside an onClick handler,
    // then the caller flips its own `open` state to true on the next render.
    act(() => {
      result.current.captureScroll();
    });

    rerender({ open: true });

    act(() => {
      vi.runAllTimers();
    });

    expect(scrollToMock).toHaveBeenCalledWith({ top: 732, behavior: 'auto' });
  });

  it('captures a fresh scroll position on every call, not just the first', () => {
    setScrollY(100);
    const { result, rerender } = renderHook(({ open }) => usePreservedScroll(open), {
      initialProps: { open: false },
    });

    act(() => {
      result.current.captureScroll();
    });
    setScrollY(900);
    act(() => {
      result.current.captureScroll();
    });

    rerender({ open: true });
    act(() => {
      vi.runAllTimers();
    });

    expect(scrollToMock).toHaveBeenCalledWith({ top: 900, behavior: 'auto' });
  });

  it('does not restore again on an unrelated re-render while restoreWhen stays true', () => {
    setScrollY(250);
    const { result, rerender } = renderHook(({ open }) => usePreservedScroll(open), {
      initialProps: { open: false },
    });

    act(() => {
      result.current.captureScroll();
    });
    rerender({ open: true });
    act(() => {
      vi.runAllTimers();
    });
    expect(scrollToMock).toHaveBeenCalledTimes(1);

    // Re-render with the same `open: true` (e.g. an unrelated state change in the caller).
    rerender({ open: true });
    act(() => {
      vi.runAllTimers();
    });

    expect(scrollToMock).toHaveBeenCalledTimes(1);
  });
});
