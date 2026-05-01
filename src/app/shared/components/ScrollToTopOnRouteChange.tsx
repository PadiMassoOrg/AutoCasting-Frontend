import { ScrollToTop } from 'autocasting-ui-library-padimasso';
import { useLocation } from 'react-router-dom';

export default function ScrollToTopOnRouteChange() {
  const { pathname, search } = useLocation();
  return <ScrollToTop watch={`${pathname}${search}`} />;
}
