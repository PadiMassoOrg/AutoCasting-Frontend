// useScrollExitOnEdge.ts
import { useEffect } from 'react';

type Options = {
  /** A qué scroller empujar el sobrante */
  forwardTo: React.RefObject<HTMLElement | null>;
};

export function useScrollExitOnEdge<E extends HTMLElement>(ref: React.RefObject<E | null>, opts: Options) {
  useEffect(() => {
    const el = ref.current;
    const parent = opts.forwardTo?.current;
    if (!el || !parent) return;

    const normalizeDeltaY = (e: WheelEvent) => {
      // deltaMode: 0=pixel, 1=line, 2=page
      if (e.deltaMode === 1) return e.deltaY * 16; // aprox 16px por línea
      if (e.deltaMode === 2) return e.deltaY * el.clientHeight;
      return e.deltaY; // pixels
    };

    const onWheel = (e: WheelEvent) => {
      const dy = normalizeDeltaY(e);
      if (dy === 0) return;

      // SIEMPRE gestionamos nosotros el scroll
      e.preventDefault();

      const maxUp = el.scrollTop; // cuánto puedo subir en panel
      const maxDown = el.scrollHeight - el.clientHeight - el.scrollTop; // cuánto puedo bajar

      // cuánto consumo dentro del panel
      const consume = Math.max(Math.min(dy, maxDown), -maxUp);
      if (consume !== 0) el.scrollTop += consume;

      const leftover = dy - consume; // sobrante para el padre
      if (leftover !== 0) {
        // Empujar al contenedor padre
        parent.scrollTop += leftover;
      }
    };

    // Capturamos y con passive:false para poder preventear siempre
    el.addEventListener('wheel', onWheel, { passive: false, capture: true });
    return () => el.removeEventListener('wheel', onWheel as EventListener);
  }, [ref, opts.forwardTo]);
}
