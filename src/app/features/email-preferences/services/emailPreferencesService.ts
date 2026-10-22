import axios from 'axios';
import { API_ROUTES } from '../../../shared/lib/routes';

// Bare axios, not the `api` instance: the link works without a session, and a stale stored JWT would
// otherwise get the request rejected with 401 and trigger a refresh/logout before unsubscribing.
export const unsubscribeFromEmails = async (token: string): Promise<void> => {
  await axios.post(import.meta.env.VITE_BASE_API_URL + API_ROUTES.API_V + API_ROUTES.EMAIL_UNSUBSCRIBE(token));
};
