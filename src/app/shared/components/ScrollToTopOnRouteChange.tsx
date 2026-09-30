import { ScrollToTop } from 'autocasting-ui-library-padimasso';
import { useLocation } from 'react-router-dom';

// The main-site landing's "view" param swaps a section in place without
// navigating, so switching between its values must not trigger the global
// scroll-to-top reset - but the param going from present to absent (or vice
// versa) is a real navigation (e.g. the logo sending you back to "/") and
// must still reset scroll. Normalizing its value (instead of dropping the
// key) keeps that presence/absence change visible in the watched string.
const NORMALIZED_PARAMS = ['view'];

export default function ScrollToTopOnRouteChange() {
  const { pathname, search } = useLocation();
  const searchParams = new URLSearchParams(search);
  NORMALIZED_PARAMS.forEach((param) => {
    if (searchParams.has(param)) searchParams.set(param, '_');
  });
  const watchedSearch = searchParams.toString();

  return <ScrollToTop watch={`${pathname}${watchedSearch ? `?${watchedSearch}` : ''}`} />;
}
