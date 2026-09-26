import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useMultiSelectLabels } from './useMultiSelectLabels';

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

describe('useMultiSelectLabels', () => {
  it('translates the select-all label', () => {
    const { result } = renderHook(() => useMultiSelectLabels());

    expect(result.current.selectAllLabel).toBe('general.select_all');
  });

  it('translates the selections count label', () => {
    const { result } = renderHook(() => useMultiSelectLabels());

    expect(result.current.selectionsLabel(3)).toBe('3 general.selections');
  });
});
