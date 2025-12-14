// shared/components/ScrollToTop/ScrollToTop.tsx
import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const MAX_FRAMES = 12; // ~200 ms a 60fps

const ScrollToTop = () => {
  const location = useLocation();

  useLayoutEffect(() => {
    let frameId: number | null = null;
    let runs = 0;

    const scrollAll = () => {
      runs += 1;

      const targets = new Set<HTMLElement | Window>();

      // Scroll global del documento
      if (typeof window !== 'undefined') {
        targets.add(window);
      }
      if (document.scrollingElement) {
        targets.add(document.scrollingElement as HTMLElement);
      }
      targets.add(document.documentElement);
      targets.add(document.body as HTMLElement);

      // Todos los roots marcados
      document.querySelectorAll<HTMLElement>('[data-scroll-root]').forEach((el) => targets.add(el));

      targets.forEach((t) => {
        if ('scrollTo' in t) {
          (t as Window | HTMLElement).scrollTo({ top: 0, left: 0, behavior: 'auto' });
        } else {
          (t as HTMLElement).scrollTop = 0;
        }
      });

      if (runs < MAX_FRAMES) {
        frameId = window.requestAnimationFrame(scrollAll);
      }
    };

    scrollAll();

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [location.pathname, location.search, location.hash]);

  return null;
};

export { ScrollToTop };
export default ScrollToTop;
