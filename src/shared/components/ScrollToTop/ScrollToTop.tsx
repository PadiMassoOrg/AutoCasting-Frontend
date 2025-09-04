// shared/components/ScrollToTop/ScrollToTop.tsx
import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

type Props = {
  selector?: string | null; // ej: '#app-scroll-root' si usas contenedor
  smooth?: boolean; // para navegaciones normales; back/forward va en 'auto'
  tries?: number; // cuántos reintentos (por layout tardío)
  intervalMs?: number; // separación entre intentos
};

export function ScrollToTop({ selector = null, smooth = false, tries = 5, intervalMs = 50 }: Props) {
  const { pathname, search, hash } = useLocation();
  const navType = useNavigationType(); // 'PUSH' | 'POP' | 'REPLACE'
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  const getTargets = () => {
    const t: (Window | HTMLElement)[] = [];
    // 1) contenedor si existe
    if (selector) {
      const el = document.querySelector(selector) as HTMLElement | null;
      if (el) t.push(el);
    }
    // 2) fallback: window y elementos raíz
    t.push(window);
    const se = document.scrollingElement;
    if (se && se !== document.documentElement) t.push(se as HTMLElement);
    t.push(document.documentElement, document.body);
    return t;
  };

  const forceTop = (behavior: ScrollBehavior) => {
    const targets = getTargets();

    targets.forEach((target) => {
      // Safari/iOS a veces ignora options → probá ambos estilos
      if (target === window) {
        // numérico
        window.scrollTo(0, 0);
        // con options (puede ignorar 'behavior', pero no hace daño)
        try {
          window.scrollTo({ top: 0, left: 0, behavior });
        } catch {}
      } else {
        const el = target as HTMLElement;
        el.scrollTop = 0;
        try {
          el.scrollTo({ top: 0, left: 0, behavior });
        } catch {}
      }
    });
  };

  const scheduleForce = (behavior: ScrollBehavior) => {
    clearTimers();

    // 0) inmediato en layoutEffect (ya ocurre más abajo)
    // 1) en el próximo frame
    requestAnimationFrame(() => forceTop(behavior));

    // 2) varios retries por si el layout cambia (imágenes, fuentes, etc.)
    for (let i = 0; i < tries; i++) {
      const id = window.setTimeout(() => forceTop(behavior), i * intervalMs);
      timers.current.push(id);
    }
  };

  // pageshow: si volvés desde bfcache, Safari restaura scroll → forzalo
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted && !hash) scheduleForce('auto');
    };
    window.addEventListener('pageshow', onPageShow as any);
    return () => window.removeEventListener('pageshow', onPageShow as any);
  }, [hash]);

  // popstate (back/forward) → forzá a top si no hay hash
  useEffect(() => {
    const onPop = () => {
      if (!hash) scheduleForce('auto');
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [hash]);

  // Antes del paint del nuevo route
  useLayoutEffect(() => {
    if (hash) return; // respetá anchors
    // En POP (volver/adelante) muchos navegadores restauran posición → ponelo en 'auto'
    const behavior: ScrollBehavior = navType === 'POP' ? 'auto' : smooth ? 'smooth' : 'auto';
    forceTop(behavior);
  }, [pathname, search, navType, hash, smooth]);

  // Reintentos post-mount (layout tardío)
  useEffect(() => {
    if (hash) return;
    const behavior: ScrollBehavior = navType === 'POP' ? 'auto' : smooth ? 'smooth' : 'auto';
    scheduleForce(behavior);
    return clearTimers;
  }, [pathname, search, navType, hash, smooth]);

  return null;
}
