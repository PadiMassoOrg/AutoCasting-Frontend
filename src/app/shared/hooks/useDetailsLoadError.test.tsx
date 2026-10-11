import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useDetailsLoadError } from './useDetailsLoadError';

const showToastMock = vi.fn();
const showErrorToastMock = vi.fn();

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
vi.mock('../../context/ToastContext', () => ({ useToast: () => ({ showToast: showToastMock }) }));
vi.mock('./useBackendErrorToast', () => ({ useBackendErrorToast: () => showErrorToastMock }));

const backendError = (status: number, message?: string) => ({
  isAxiosError: true,
  response: { status, data: { status, message } },
});

describe('useDetailsLoadError', () => {
  const onFail = vi.fn();

  beforeEach(() => {
    showToastMock.mockReset();
    showErrorToastMock.mockReset();
    onFail.mockReset();
  });

  it('shows the unavailable warning and fails once for a 404', () => {
    const { result } = renderHook(() =>
      useDetailsLoadError({ error: backendError(404), unavailableMessageKey: 'events.unavailable', onFail })
    );

    expect(result.current).toBe(true);
    expect(showToastMock).toHaveBeenCalledWith({
      title: 'state.no_results',
      description: 'events.unavailable',
      type: 'warning',
      durationMs: 7000,
      closable: true,
    });
    expect(showErrorToastMock).not.toHaveBeenCalled();
    expect(onFail).toHaveBeenCalledTimes(1);
  });

  it('shows the backend error toast for other failures', () => {
    renderHook(() =>
      useDetailsLoadError({
        error: backendError(500, 'server_error.general.unexpected'),
        unavailableMessageKey: 'events.unavailable',
        onFail,
      })
    );

    expect(showErrorToastMock).toHaveBeenCalledWith('server_error.general.unexpected');
    expect(showToastMock).not.toHaveBeenCalled();
    expect(onFail).toHaveBeenCalledTimes(1);
  });

  it('falls back to the generic server error when the failure has no backend message', () => {
    renderHook(() =>
      useDetailsLoadError({ error: new Error(''), unavailableMessageKey: 'events.unavailable', onFail })
    );

    expect(showErrorToastMock).toHaveBeenCalledWith('state.server_err');
  });

  it('handles the same error only once across re-renders', () => {
    const error = backendError(404);
    const { rerender } = renderHook(() =>
      useDetailsLoadError({ error, unavailableMessageKey: 'events.unavailable', onFail })
    );

    rerender();
    rerender();

    expect(showToastMock).toHaveBeenCalledTimes(1);
    expect(onFail).toHaveBeenCalledTimes(1);
  });

  it('handles a new error again', () => {
    let error: unknown = backendError(404);
    const { rerender } = renderHook(() =>
      useDetailsLoadError({ error, unavailableMessageKey: 'events.unavailable', onFail })
    );

    error = backendError(404);
    rerender();

    expect(onFail).toHaveBeenCalledTimes(2);
  });

  it('does nothing without an error', () => {
    const { result } = renderHook(() =>
      useDetailsLoadError({ error: null, unavailableMessageKey: 'events.unavailable', onFail })
    );

    expect(result.current).toBe(false);
    expect(showToastMock).not.toHaveBeenCalled();
    expect(showErrorToastMock).not.toHaveBeenCalled();
    expect(onFail).not.toHaveBeenCalled();
  });
});
