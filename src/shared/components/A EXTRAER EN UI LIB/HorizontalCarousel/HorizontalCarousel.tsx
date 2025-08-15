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

  return (
    <div
      className={`relative overflow-hidden ${className ?? ''}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onKeyDown={onKeyDown}
      tabIndex={0}
      aria-roledescription="carousel"
    >
      <div
        className="flex transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${active * 100}%)`, width: `${slides.length * 100}%` }}
      >
        {slides.map((child, idx) => (
          <div key={idx} className="w-full shrink-0 px-1">
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
