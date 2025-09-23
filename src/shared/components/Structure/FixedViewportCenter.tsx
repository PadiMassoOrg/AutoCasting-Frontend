import React, { useEffect, useMemo } from 'react';
import { useMeasuredHeight } from '../../hooks/useMeasuredHeight';
import { useViewportVhVar } from '../../hooks/useViewportVhVar';

type Props = {
  avoid?: string | HTMLElement | null;
  lockBodyScroll?: boolean;
  className?: string;
  children: React.ReactNode;
};

export default function FixedViewportCenter({
  avoid = '#app-navbar',
  lockBodyScroll = true,
  className,
  children,
}: Props) {
  useViewportVhVar();
  const navH = useMeasuredHeight(avoid);

  useEffect(() => {
    if (!lockBodyScroll) return;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [lockBodyScroll]);

  const heightStyle = useMemo(() => `calc((var(--app-vh, 1vh) * 100) - ${navH}px)`, [navH]);

  return (
    <div
      className={`fixed left-0 right-0 z-40 grid place-items-center ${className ?? ''}`}
      style={{
        top: `${navH}px`,
        height: heightStyle,
      }}
    >
      {children}
    </div>
  );
}
