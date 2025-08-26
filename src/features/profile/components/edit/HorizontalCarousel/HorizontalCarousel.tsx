import React, { useEffect, useRef } from 'react';

type Props = {
  active: number;
  onChange: (index: number) => void;
  children: React.ReactNode[] | React.ReactNode;
  className?: string;
};

export default function HorizontalCarousel({ active, onChange, children, className }: Props) {
  const slides = React.Children.toArray(children);

  const startX = useRef<number | null>(null);
  const deltaX = useRef(0);

  const clamp = (n: number) => Math.max(0, Math.min(slides.length - 1, n));
  const go = (i: number) => onChange(clamp(i));
  const next = () => go(active + 1);
  const prev = () => go(active - 1);

  const onTouchStart: React.TouchEventHandler = (e) => {
    startX.current = e.touches[0].clientX;
    deltaX.current = 0;
  };
  const onTouchMove: React.TouchEventHandler = (e) => {
    if (startX.current == null) return;
    deltaX.current = e.touches[0].clientX - startX.current;
  };
  const onTouchEnd: React.TouchEventHandler = () => {
    if (Math.abs(deltaX.current) > 50) deltaX.current < 0 ? next() : prev();
    startX.current = null;
    deltaX.current = 0;
  };

  const onKeyDown: React.KeyboardEventHandler = (e) => {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  };

  // ---- altura auto según slide activo ----
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Asegurá que el array de refs tenga mismo largo que slides
  useEffect(() => {
    slideRefs.current = Array(slides.length).fill(null);
  }, [slides.length]);

  const setAutoHeight = () => {
    const wrap = wrapperRef.current;
    const node = slideRefs.current[active];
    if (!wrap || !node) return;
    const h = node.offsetHeight;
    wrap.style.height = h ? `${h}px` : 'auto';
  };

  useEffect(() => {
    setAutoHeight();
  }, [active, slides.length]);

  useEffect(() => {
    const node = slideRefs.current[active];
    if (!node) return;

    const ro = new ResizeObserver(() => setAutoHeight());
    ro.observe(node);

    const onWin = () => setAutoHeight();
    window.addEventListener('resize', onWin);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', onWin);
    };
  }, [active]);

  const step = slides.length ? 100 / slides.length : 100;

  return (
    <div
      className={`relative w-full overflow-hidden ${className ?? ''}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onKeyDown={onKeyDown}
      tabIndex={0}
      aria-roledescription="carousel"
      ref={wrapperRef}
      style={{ transition: 'height 200ms ease' }}
    >
      <div
        ref={trackRef}
        className="flex w-full min-w-0 items-start transition-transform duration-300 ease-out"
        style={{ width: `${slides.length * 100}%`, transform: `translateX(-${active * step}%)` }}
      >
        {slides.map((child, idx) => (
          <div
            key={idx}
            // ⬇️ callback-ref que NO devuelve nada (void)
            ref={(el) => {
              slideRefs.current[idx] = el;
            }}
            className="shrink-0 grow-0 min-w-0 box-border px-1"
            style={{ width: `${step}%` }}
          >
            <div className="w-full min-w-0">{child}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
