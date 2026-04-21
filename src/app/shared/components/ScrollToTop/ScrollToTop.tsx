import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const MAX_FRAMES = 10;
const TIMEOUT_MS = 180;

function scrollDocumentToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
}

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    if (!('scrollRestoration' in window.history)) return;

    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';

    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  useLayoutEffect(() => {
    let cancelled = false;
    let frameId: number | null = null;
    let timeoutId: number | null = null;
    let runs = 0;

    const run = () => {
      if (cancelled) return;
      scrollDocumentToTop();

      runs += 1;

      if (runs < MAX_FRAMES) {
        frameId = window.requestAnimationFrame(run);
      }
    };

    frameId = window.requestAnimationFrame(run);

    timeoutId = window.setTimeout(() => {
      if (cancelled) return;
      scrollDocumentToTop();
    }, TIMEOUT_MS);

    return () => {
      cancelled = true;

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [location.pathname, location.search]);

  return null;
};

export default ScrollToTop;
export { ScrollToTop };
