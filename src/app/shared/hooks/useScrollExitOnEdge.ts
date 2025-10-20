import { useEffect } from 'react';

type Options = {
  forwardTo: React.RefObject<HTMLElement | null>;
};

export function useScrollExitOnEdge<E extends HTMLElement>(ref: React.RefObject<E | null>, opts: Options) {
  useEffect(() => {
    const el = ref.current;
    const parent = opts.forwardTo?.current;
    if (!el || !parent) return;

    const normalizeDeltaY = (e: WheelEvent) => {
      if (e.deltaMode === 1) return e.deltaY * 16;
      if (e.deltaMode === 2) return e.deltaY * el.clientHeight;
      return e.deltaY; // pixels
    };

    const onWheel = (e: WheelEvent) => {
      const dy = normalizeDeltaY(e);

      if (dy === 0) return;

      e.preventDefault();

      const maxUp = el.scrollTop;
      const maxDown = el.scrollHeight - el.clientHeight - el.scrollTop;
      const consume = Math.max(Math.min(dy, maxDown), -maxUp);
      if (consume !== 0) el.scrollTop += consume;
      const leftover = dy - consume;
      if (leftover !== 0) {
        parent.scrollTop += leftover;
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false, capture: true });
    return () => el.removeEventListener('wheel', onWheel as EventListener);
  }, [ref, opts.forwardTo]);
}
