// HorizontalCarousel.tsx
import React, { useEffect, useRef } from 'react';

type Props = {
  active: number;
  onChange: (index: number) => void;
  children: React.ReactNode[] | React.ReactNode;
  className?: string;
};

export default function HorizontalCarousel({ active, onChange, children, className }: Props) {
  const slides = React.Children.toArray(children);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScroll = useRef(false);

  // Scroll al slide activo cuando cambia `active`
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const x = active * el.clientWidth;
    isProgrammaticScroll.current = true;
    el.scrollTo({ left: x, behavior: 'smooth' });
    // desbloqueo el flag después de un tiempo razonable
    const id = window.setTimeout(() => (isProgrammaticScroll.current = false), 350);
    return () => window.clearTimeout(id);
  }, [active]);

  // Sincroniza el índice al hacer scroll manual (wheel/touchpad/arrastre)
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let raf = 0;
    const onScroll = () => {
      if (isProgrammaticScroll.current) return; // ignora scroll programático
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const w = el.clientWidth || 1;
        const idx = Math.round(el.scrollLeft / w);
        if (idx !== active) onChange(idx);
      });
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('scroll', onScroll);
    };
  }, [active, onChange]);

  // Reparaciones al volver con back/forward (bfcache) y visibilidad
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const resync = () => {
      const x = active * el.clientWidth;
      el.scrollTo({ left: x, behavior: 'auto' });
    };

    const onPageShow = (e: PageTransitionEvent) => {
      // @ts-ignore persisted puede no estar tipado
      if (e.persisted) requestAnimationFrame(() => requestAnimationFrame(resync));
      else requestAnimationFrame(resync);
    };
    const onVis = () => {
      if (document.visibilityState === 'visible') {
        requestAnimationFrame(() => requestAnimationFrame(resync));
      }
    };
    const onResize = () => {
      requestAnimationFrame(resync);
    };

    window.addEventListener('pageshow', onPageShow);
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('pageshow', onPageShow);
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('resize', onResize);
    };
  }, [active]);

  // Asegura que cada slide ocupe exactamente el ancho visible
  return (
    <div className={`relative w-full min-w-0 ${className ?? ''}`}>
      <div
        ref={scrollerRef}
        className="
          w-full min-w-0 overflow-x-auto overflow-y-hidden
          flex snap-x snap-mandatory scroll-pl-0
          scrollbar-hide
        "
        // accesibilidad
        tabIndex={0}
        aria-roledescription="carousel"
      >
        {slides.map((child, idx) => (
          <div key={idx} className="snap-start shrink-0 grow-0 basis-full min-w-0">
            {/* padding interno, no en el slide contenedor */}
            <div className="w-full min-w-0 px-1">{child}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* CSS opcional para ocultar scrollbar si quieres (global o Tailwind plugin):
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
*/
