import { ScrollToTop } from 'autocasting-ui-library-padimasso';
import { useLocation } from 'react-router-dom';

// The main-site landing's "view" param swaps a section in place without
// navigating - it must not trigger the global scroll-to-top reset.
const PARAMS_EXCLUDED_FROM_WATCH = ['view'];

export default function ScrollToTopOnRouteChange() {
  const { pathname, search } = useLocation();
  const searchParams = new URLSearchParams(search);
  PARAMS_EXCLUDED_FROM_WATCH.forEach((param) => searchParams.delete(param));
  const watchedSearch = searchParams.toString();

  return <ScrollToTop watch={`${pathname}${watchedSearch ? `?${watchedSearch}` : ''}`} />;
}
