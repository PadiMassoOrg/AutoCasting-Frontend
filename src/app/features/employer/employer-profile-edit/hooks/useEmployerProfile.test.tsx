import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { EmployerProfileResponse } from '../types/employerProfile.types';
import { useEmployerProfile } from './useEmployerProfile';

const getMyProfileMock = vi.fn();
const getRawAuthTokenMock = vi.fn();

vi.mock('../services/employerProfileService', () => ({
  EMPLOYER_PROFILE_CACHE_KEY: ['employer-cache-profile'],
  getMyProfile: () => getMyProfileMock(),
}));

vi.mock('../../../../shared/lib/cookies', () => ({
  getRawAuthToken: () => getRawAuthTokenMock(),
}));

const profileFixture: EmployerProfileResponse = {
  id: 'employer-1',
  email: 'employer@example.com',
  userAccountProvider: 'LOCAL',
  roleStringCode: 'sitemetadata.role.employer',
  planStringCode: 'sitemetadata.plan.free',
  basicInfo: {
    id: 'basic-info-1',
    companyName: 'Acme Productions',
    taxNumber: '30-12345678-9',
    companyType: null,
    companyEmail: null,
    imageUrl: null,
    address: null,
    websiteUrl: null,
    about: null,
    socialMedia: null,
  },
};

const wrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('useEmployerProfile', () => {
  beforeEach(() => {
    getMyProfileMock.mockReset();
    getRawAuthTokenMock.mockReset();
  });

  it('fetches the employer profile when a token is present', async () => {
    getRawAuthTokenMock.mockReturnValue('a-jwt-token');
    getMyProfileMock.mockResolvedValue(profileFixture);

    const { result } = renderHook(() => useEmployerProfile(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(profileFixture);
    expect(getMyProfileMock).toHaveBeenCalledTimes(1);
  });

  it('does not fetch when there is no auth token', () => {
    getRawAuthTokenMock.mockReturnValue(null);

    renderHook(() => useEmployerProfile(), { wrapper });

    expect(getMyProfileMock).not.toHaveBeenCalled();
  });

  it('surfaces a fetch error', async () => {
    // The hook hardcodes retry: 1, so react-query retries once (with backoff) before
    // settling into the error state — this test needs a longer waitFor timeout to
    // account for that real retry delay rather than fighting the hook's own behavior.
    getRawAuthTokenMock.mockReturnValue('a-jwt-token');
    getMyProfileMock.mockRejectedValue(new Error('network error'));

    const { result } = renderHook(() => useEmployerProfile(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true), { timeout: 3000 });

    expect(result.current.data).toBeUndefined();
  });
});
