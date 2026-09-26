import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useClientPagination } from './useClientPagination';

const items = ['a', 'b', 'c', 'd', 'e'];

describe('useClientPagination', () => {
  it('starts on the first page', () => {
    const { result } = renderHook(() => useClientPagination(items, 2));

    expect(result.current.page).toBe(0);
    expect(result.current.pageItems).toEqual(['a', 'b']);
    expect(result.current.hasNext).toBe(true);
    expect(result.current.totalCount).toBe(5);
  });

  it('returns the items of the selected page', () => {
    const { result } = renderHook(() => useClientPagination(items, 2));

    act(() => result.current.setPage(2));

    expect(result.current.pageItems).toEqual(['e']);
    expect(result.current.hasNext).toBe(false);
  });

  it('reveals one more page at a time and stops at the last one', () => {
    const { result } = renderHook(() => useClientPagination(items, 2));

    act(() => result.current.loadMore());
    expect(result.current.revealedItems).toEqual(['a', 'b', 'c', 'd']);

    act(() => result.current.loadMore());
    act(() => result.current.loadMore());
    expect(result.current.revealedItems).toEqual(items);
    expect(result.current.page).toBe(2);
  });

  it('clamps to the last page when the list shrinks', () => {
    const { result, rerender } = renderHook(({ list }) => useClientPagination(list, 2), {
      initialProps: { list: items },
    });

    act(() => result.current.setPage(2));
    rerender({ list: ['a', 'b'] });

    expect(result.current.page).toBe(0);
    expect(result.current.pageItems).toEqual(['a', 'b']);
  });

  it('has a single page when everything fits in it', () => {
    const { result } = renderHook(() => useClientPagination(['a'], 2));

    expect(result.current.pageItems).toEqual(['a']);
    expect(result.current.hasNext).toBe(false);
  });
});
