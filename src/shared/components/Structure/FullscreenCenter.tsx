import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useViewportVhVar } from '../../hooks/useViewportVhVar';

type Props = {
  zIndex?: number;
  lockBodyScroll?: boolean;
  className?: string;
  children: React.ReactNode;
};

export default function FullscreenCenter({ zIndex = 1, lockBodyScroll = true, className, children }: Props) {
  useViewportVhVar();

  useEffect(() => {
    if (!lockBodyScroll) return;
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, [lockBodyScroll]);

  const node = (
    <div
      className={`fixed inset-0 grid place-items-center ${className ?? ''}`}
      style={{
        zIndex,
        height: 'calc(var(--app-vh, 1vh) * 100)',
      }}
      aria-modal="true"
      role="dialog"
    >
      {children}
    </div>
  );

  return createPortal(node, document.body);
}
