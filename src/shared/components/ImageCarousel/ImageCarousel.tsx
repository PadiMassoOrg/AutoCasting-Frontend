import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight } from '../Chevron';

type Props = {
  open: boolean;
  images: string[] | null; // puede ser null
  initialIndex?: number;
  onClose: () => void;
  onIndexChange?: (i: number) => void;
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export default function PhotoZoomOverlay({ open, images, initialIndex = 0, onClose, onIndexChange }: Props) {
  // total seguro aunque images sea null
  const total = images?.length ?? 0;

  // index seguro: si no hay imágenes no importa el valor, pero mantengo 0
  const [idx, setIdx] = useState(() => (total > 0 ? clamp(initialIndex, 0, total - 1) : 0));

  // si cambia open/initialIndex/images, realinear idx
  useEffect(() => {
    if (!open) return;
    if (total === 0) {
      setIdx(0);
    } else {
      setIdx(clamp(initialIndex, 0, total - 1));
    }
  }, [open, initialIndex, total]);

  const current = useMemo<string | null>(() => {
    if (!images || total === 0) return null;
    return images[idx] ?? images[0] ?? null;
  }, [images, total, idx]);

  const hasArrows = total > 1;

  const prev = useCallback(() => {
    if (total < 2) return;
    setIdx((i) => (i - 1 + total) % total);
  }, [total]);

  const next = useCallback(() => {
    if (total < 2) return;
    setIdx((i) => (i + 1) % total);
  }, [total]);

  // fix de 100dvh para iOS/Chrome mobile barras variables
  useEffect(() => {
    if (!open) return;
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVh();
    window.addEventListener('resize', setVh);
    return () => window.removeEventListener('resize', setVh);
  }, [open]);

  // bloquear scroll de la página detrás
  useEffect(() => {
    if (!open) return;

    const scrollY = window.scrollY || 0;
    const body = document.body;

    const savedBodyStyles = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
      overscrollBehavior: (body.style as any).overscrollBehavior as string | undefined,
    };

    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflow = 'hidden';
    (body.style as any).overscrollBehavior = 'none';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      body.style.position = savedBodyStyles.position;
      body.style.top = savedBodyStyles.top!;
      body.style.left = savedBodyStyles.left!;
      body.style.right = savedBodyStyles.right!;
      body.style.width = savedBodyStyles.width!;
      body.style.overflow = savedBodyStyles.overflow!;
      if (savedBodyStyles.overscrollBehavior != null) {
        (body.style as any).overscrollBehavior = savedBodyStyles.overscrollBehavior;
      } else {
        (body.style as any).removeProperty?.('overscroll-behavior');
      }
      window.removeEventListener('keydown', onKey);
      window.scrollTo(0, scrollY);
    };
  }, [open, onClose, prev, next]);

  useEffect(() => {
    if (open) onIndexChange?.(idx);
  }, [idx, onIndexChange, open]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] w-screen touch-none"
      style={{ height: '100dvh', minHeight: 'calc(var(--vh, 1vh) * 100)' }}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80" />

      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div
          className="relative w-[90%] h-[90%] max-w-[600px] max-h-[700px] m-auto rounded-3xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="cursor-pointer absolute z-10 right-3 top-3 w-9 h-9 grid place-items-center rounded-full bg-black/50 text-white"
          >
            <span className="text-2xl leading-none mb-[10%]">×</span>
          </button>

          <figure className="relative w-full h-full overflow-hidden rounded-2xl bg-white">
            {current ? (
              <>
                <img
                  src={current}
                  alt={`Foto ${idx + 1} de ${total}`}
                  className="absolute inset-0 w-full h-full object-cover select-none"
                  draggable={false}
                />

                {hasArrows && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        prev();
                      }}
                      aria-label="Foto anterior"
                      className="absolute left-5 top-1/2 -translate-y-1/2 grid place-items-center w-8 h-8 rounded-full bg-white/95 hover:bg-white"
                    >
                      <ChevronLeft />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        next();
                      }}
                      aria-label="Foto siguiente"
                      className="absolute right-5 top-1/2 -translate-y-1/2 grid place-items-center w-8 h-8 rounded-full bg-white/95 hover:bg-white"
                    >
                      <ChevronRight />
                    </button>
                  </>
                )}
              </>
            ) : (
              // Placeholder cuando images es null o vacío
              <div className="absolute inset-0 flex items-center justify-center">
                <svg width="120" height="120" viewBox="0 0 24 24" aria-hidden="true" className="opacity-50">
                  <rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" />
                  <path d="M7 15l3-3 3 3 4-4 2 2v4H5v-2z" fill="#fff" />
                </svg>
              </div>
            )}
          </figure>
        </div>
      </div>
    </div>,
    document.body
  );
}
