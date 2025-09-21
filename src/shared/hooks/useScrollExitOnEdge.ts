import { type RefObject, useEffect } from 'react';

type Options = {
  forwardLeftoverToWindow?: boolean;
};

export function useScrollExitOnEdge<E extends HTMLElement>(
  ref: RefObject<E | null>,
  { forwardLeftoverToWindow = true }: Options = {}
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

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

      if (leftover !== 0 && forwardLeftoverToWindow) {
        e.preventDefault();
        window.scrollBy({ top: leftover, behavior: 'auto' });
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false } as AddEventListenerOptions);
    return () => el.removeEventListener('wheel', onWheel as EventListener);
  }, [ref, forwardLeftoverToWindow]);
}
