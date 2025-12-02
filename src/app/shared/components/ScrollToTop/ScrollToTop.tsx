import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type ScrollToTopProps = {
  selector: string;
};

const ScrollToTop = ({ selector }: ScrollToTopProps) => {
  const { pathname } = useLocation();

  useEffect(() => {
    let frame: number | null = null;
    let attempts = 0;
    const maxAttempts = 20;

    const tick = () => {
      attempts += 1;

      const el = document.querySelector<HTMLElement>(selector);
      if (el) {
        if (typeof el.scrollTo === 'function') {
          el.scrollTo({ top: 0 });
        } else {
          el.scrollTop = 0;
        }
      }

      if (attempts < maxAttempts) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    tick();

    return () => {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [pathname, selector]);

  return null;
};

export { ScrollToTop };
export default ScrollToTop;
