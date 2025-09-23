import { useEffect, useMemo, useState } from 'react';

export function useMeasuredHeight(target?: string | HTMLElement | null) {
  const [height, setHeight] = useState(0);

  const el = useMemo<HTMLElement | null>(() => {
    if (typeof target === 'string') return document.querySelector(target) as HTMLElement | null;
    if (target instanceof HTMLElement) return target;
    return null;
  }, [target]);

  useEffect(() => {
    if (!el) return;
    const update = () => setHeight(el.getBoundingClientRect().height);

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);

    window.addEventListener('resize', update);
    return () => {
      try {
        ro.disconnect();
      } catch {}
      window.removeEventListener('resize', update);
    };
  }, [el]);

  return height;
}
