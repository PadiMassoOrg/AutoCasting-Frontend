import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useNotFoundRedirect } from './useNotFoundRedirect';

const navigateMock = vi.fn();
const showToastMock = vi.fn();

vi.mock('react-router-dom', () => ({ useNavigate: () => navigateMock }));
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
vi.mock('../../context/ToastContext', () => ({ useToast: () => ({ showToast: showToastMock }) }));

const backendError = (status: number) => ({ isAxiosError: true, response: { status, data: {} } });

describe('useNotFoundRedirect', () => {
  beforeEach(() => {
    navigateMock.mockReset();
    showToastMock.mockReset();
  });

  it('redirects with a warning toast when the backend answers 404', () => {
    const { result } = renderHook(() =>
      useNotFoundRedirect(backendError(404), '/casting-database', 'casting.unavailable')
    );

    expect(result.current).toBe(true);
    expect(showToastMock).toHaveBeenCalledWith({
      title: 'state.no_results',
      description: 'casting.unavailable',
      type: 'warning',
      durationMs: 7000,
      closable: true,
    });
    expect(navigateMock).toHaveBeenCalledWith('/casting-database', { replace: true });
  });

  it('does nothing for other errors so the page can show its error state', () => {
    const { result } = renderHook(() =>
      useNotFoundRedirect(backendError(500), '/casting-database', 'casting.unavailable')
    );

    expect(result.current).toBe(false);
    expect(showToastMock).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it('does nothing without an error', () => {
    const { result } = renderHook(() => useNotFoundRedirect(null, '/casting-database', 'casting.unavailable'));

    expect(result.current).toBe(false);
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
