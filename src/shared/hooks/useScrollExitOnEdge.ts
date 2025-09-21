import { useEffect } from 'react';

type Options = {
  forwardTo?: 'window' | React.RefObject<HTMLElement | null>;
};

export function useScrollExitOnEdge<E extends HTMLElement>(ref: React.RefObject<E | null>, opts: Options = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const forwardTarget = opts.forwardTo ?? 'window';

    const onWheel = (e: WheelEvent) => {
      const dy = e.deltaY;
      const maxUp = el.scrollTop;
      const maxDown = el.scrollHeight - el.clientHeight - el.scrollTop;
      const consume = Math.max(Math.min(dy, maxDown), -maxUp);

      if (consume !== 0) {
        e.preventDefault();
        el.scrollTop += consume;
      }

      const leftover = dy - consume;
      if (leftover !== 0) {
        e.preventDefault();
        if (forwardTarget === 'window') {
          window.scrollBy({ top: leftover, behavior: 'auto' });
        } else {
          const parentEl = forwardTarget.current;
          if (parentEl) parentEl.scrollTop += leftover;
        }
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false } as AddEventListenerOptions);
    return () => el.removeEventListener('wheel', onWheel as EventListener);
  }, [ref, opts.forwardTo]);
}
