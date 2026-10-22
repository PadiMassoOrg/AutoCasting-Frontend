import { render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ROUTES } from '../../../shared/lib/routes';
import UnsubscribeRedirect from './UnsubscribeRedirect';

const unsubscribeMock = vi.fn();
const navigateMock = vi.fn();
const showToastMock = vi.fn();

vi.mock('../services/emailPreferencesService', () => ({
  unsubscribeFromEmails: (token: string) => unsubscribeMock(token),
}));
vi.mock('../../../context/ToastContext', () => ({ useToast: () => ({ showToast: showToastMock }) }));
vi.mock('react-router-dom', () => ({ useNavigate: () => navigateMock, useParams: () => ({ token: 'token-1' }) }));
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

describe('UnsubscribeRedirect', () => {
  beforeEach(() => {
    unsubscribeMock.mockReset();
    navigateMock.mockReset();
    showToastMock.mockReset();
  });

  it('goes home right away and toasts once the link token is unsubscribed', async () => {
    unsubscribeMock.mockResolvedValue(undefined);

    render(<UnsubscribeRedirect />);

    expect(navigateMock).toHaveBeenCalledWith(ROUTES.HOME, { replace: true });
    expect(unsubscribeMock).toHaveBeenCalledTimes(1);
    expect(unsubscribeMock).toHaveBeenCalledWith('token-1');
    await waitFor(() => expect(showToastMock.mock.calls[0][0].description).toBe('email_preferences.unsubscribed'));
  });

  it('toasts a warning when the link is invalid', async () => {
    unsubscribeMock.mockRejectedValue(new Error('404'));

    render(<UnsubscribeRedirect />);

    await waitFor(() => expect(showToastMock.mock.calls[0][0].description).toBe('email_preferences.link_invalid'));
  });
});
