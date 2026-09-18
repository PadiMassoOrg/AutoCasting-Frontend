import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { RegisterRequest } from '../types/auth.types';
import { useRegisterMutation } from './useRegisterMutation';

const registerAndAcceptLegalMock = vi.fn();
const setAuthTokensMock = vi.fn();
const navigateMock = vi.fn();

vi.mock('../services/authService', () => ({
  registerAndAcceptLegal: (...args: unknown[]) => registerAndAcceptLegalMock(...args),
}));

vi.mock('../../../shared/lib/cookies', () => ({
  setAuthTokens: (...args: unknown[]) => setAuthTokensMock(...args),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
}));

vi.mock('i18next', () => ({
  default: { language: 'es' },
}));

const wrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

const registerPayload: RegisterRequest = { email: 'user@example.com', password: 'secret1' };

describe('useRegisterMutation', () => {
  beforeEach(() => {
    registerAndAcceptLegalMock.mockReset();
    setAuthTokensMock.mockReset();
    navigateMock.mockReset();
  });

  it('calls registerAndAcceptLegal with the payload and current language', async () => {
    registerAndAcceptLegalMock.mockResolvedValue({ token: 'jwt-token', refreshToken: 'refresh-token' });

    const { result } = renderHook(() => useRegisterMutation(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(registerPayload);
    });

    expect(registerAndAcceptLegalMock).toHaveBeenCalledWith(registerPayload, 'es');
  });

  it('sets auth tokens and navigates to the dashboard on success', async () => {
    registerAndAcceptLegalMock.mockResolvedValue({ token: 'jwt-token', refreshToken: 'refresh-token' });

    const { result } = renderHook(() => useRegisterMutation(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(registerPayload);
    });

    expect(setAuthTokensMock).toHaveBeenCalledWith('jwt-token', 'refresh-token');
    expect(navigateMock).toHaveBeenCalledWith('/dashboard', { replace: true });
  });

  it('does not set tokens or navigate when registration fails', async () => {
    registerAndAcceptLegalMock.mockRejectedValue(new Error('email already exists'));

    const { result } = renderHook(() => useRegisterMutation(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(registerPayload).catch(() => undefined);
    });

    expect(setAuthTokensMock).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
