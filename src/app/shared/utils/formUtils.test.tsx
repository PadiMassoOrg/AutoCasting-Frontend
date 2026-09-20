import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useCommittedText } from './formUtils';

describe('useCommittedText', () => {
  it('commits the (optionally transformed) value on blur when it changed', () => {
    const commitFn = vi.fn();
    const { result } = renderHook(() => useCommittedText('initial', commitFn, { trim: true }));

    act(() => {
      result.current.onChange({ target: { value: 'next value' } } as React.ChangeEvent<HTMLInputElement>);
    });
    act(() => {
      result.current.onBlur({} as React.FocusEvent<HTMLInputElement>);
    });

    expect(commitFn).toHaveBeenCalledWith('next value');
  });

  it('applies transform on every keystroke', () => {
    const commitFn = vi.fn();
    const { result } = renderHook(() =>
      useCommittedText('', commitFn, { trim: true, transform: (v) => v.toUpperCase() })
    );

    act(() => {
      result.current.onChange({ target: { value: 'm' } } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.value).toBe('M');
  });

  // Regression test: an earlier version of useCommittedText keyed its resync-from-`initial`
  // effect on `apply` (a useCallback depending on `opts.transform`'s identity). Since callers
  // pass `transform` as an inline arrow function — a new reference on every render — that effect
  // refired on every render, including the one triggered by the input's own onChange, snapping
  // `value` back to `initial` before the user's edit could ever be seen or committed. This is
  // exactly the shape a real caller (CharacteristicsForm) uses: a fresh inline transform per render.
  it('does not reset the typed value when the caller passes a new inline transform reference every render', () => {
    const commitFn = vi.fn();
    const { result, rerender } = renderHook(
      ({ transform }: { transform: (v: string) => string }) =>
        useCommittedText('', commitFn, { trim: true, transform }),
      { initialProps: { transform: (v: string) => v.toUpperCase() } }
    );

    act(() => {
      result.current.onChange({ target: { value: 'm' } } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.value).toBe('M');

    // Simulate the parent re-rendering with a brand-new transform function reference (as it would
    // on every keystroke-triggered render in a real form), without `initial` itself changing.
    rerender({ transform: (v: string) => v.toUpperCase() });
    expect(result.current.value).toBe('M');

    act(() => {
      result.current.onChange({ target: { value: 'me' } } as React.ChangeEvent<HTMLInputElement>);
    });
    rerender({ transform: (v: string) => v.toUpperCase() });
    expect(result.current.value).toBe('ME');

    act(() => {
      result.current.onBlur({} as React.FocusEvent<HTMLInputElement>);
    });
    expect(commitFn).toHaveBeenCalledWith('ME');
  });

  it('resyncs from a genuinely new initial value', () => {
    const commitFn = vi.fn();
    const { result, rerender } = renderHook(({ initial }: { initial: string }) => useCommittedText(initial, commitFn), {
      initialProps: { initial: 'first' },
    });

    expect(result.current.value).toBe('first');

    rerender({ initial: 'second' });

    expect(result.current.value).toBe('second');
  });
});
