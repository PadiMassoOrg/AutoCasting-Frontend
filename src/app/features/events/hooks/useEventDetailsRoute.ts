import { useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../../shared/lib/routes';

type EventsLocationState = { fromEventsList?: boolean } | null;

// The open event lives in the URL (/events/:slug), so a shared link opens its details directly.
export function useEventDetailsRoute() {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const openedFromList = (location.state as EventsLocationState)?.fromEventsList === true;

  const openEvent = useCallback(
    (eventSlug: string) => navigate(`${ROUTES.EVENTS}/${eventSlug}`, { state: { fromEventsList: true } }),
    [navigate]
  );

  // Opened from the list: step back, so the browser's Back never reopens the closed event.
  // Opened from a shared link: there is no list entry to step back to, so replace the entry instead.
  const closeEvent = useCallback(
    () => (openedFromList ? navigate(-1) : navigate(ROUTES.EVENTS, { replace: true })),
    [navigate, openedFromList]
  );

  return { slug, openEvent, closeEvent };
}
