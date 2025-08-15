import React, { useRef } from 'react';

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

  // porcentaje de desplazamiento por slide
  const step = 100 / slides.length;

  return (
    <div
      className={`relative w-full overflow-hidden ${className ?? ''}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onKeyDown={onKeyDown}
      tabIndex={0}
      aria-roledescription="carousel"
    >
      <div
        className="flex w-full min-w-0 transition-transform duration-300 ease-out"
        // nos movemos en pasos de (100 / slides)%
        style={{
          width: `${slides.length * 100}%`,
          transform: `translateX(-${active * step}%)`,
        }}
      >
        {slides.map((child, idx) => (
          <div
            key={idx}
            // cada slide ocupa 1/N del track, puede encoger, y su padding no suma ancho
            className="shrink-0 grow-0 min-w-0 box-border px-1"
            style={{ width: `${step}%` }}
          >
            {/* wrapper interno por si querés paddings propios del slide */}
            <div className="w-full min-w-0">{child}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
