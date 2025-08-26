// shared/components/ScrollToTop/ScrollToTop.tsx
import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

type Props = {
  selector?: string | null; // ej: '#page-scroll-root' si usas contenedor
  smooth?: boolean;
};

export function ScrollToTop({ selector = '#public-page-scroll-root', smooth = false }: Props) {
  const { pathname, search, hash } = useLocation();

  // Desactiva la restauración nativa del navegador
  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  const doScroll = () => {
    if (hash) return; // si hay #anchor, respétalo
    const behavior: ScrollBehavior = smooth ? 'smooth' : 'auto';

    // 1) contenedor designado (si existe)
    const el = selector ? (document.querySelector(selector) as HTMLElement | null) : null;
    if (el) el.scrollTo({ top: 0, left: 0, behavior });

    // 2) por las dudas, también la ventana y roots
    window.scrollTo({ top: 0, left: 0, behavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  // Antes del paint del nuevo route (evita “saltos”)
  useLayoutEffect(() => {
    doScroll();
  }, [pathname, search]);

  // Reaplica un tick después (por imágenes/layout tardío)
  useEffect(() => {
    const id = setTimeout(doScroll, 50);
    return () => clearTimeout(id);
  }, [pathname, search]);

  return null;
}
