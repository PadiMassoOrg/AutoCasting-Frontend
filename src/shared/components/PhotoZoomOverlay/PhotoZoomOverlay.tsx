import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight } from '../Chevron';

type Props = {
  open: boolean;
  images: string[];
  initialIndex?: number;
  onClose: () => void;
  onIndexChange?: (i: number) => void;
};

export default function PhotoZoomOverlay({ open, images, initialIndex = 0, onClose, onIndexChange }: Props) {
  const [idx, setIdx] = useState(initialIndex);

  useEffect(() => {
    if (open) setIdx(initialIndex);
  }, [open, initialIndex]);

  const total = images.length;
  const current = useMemo(() => images[idx] ?? images[0], [images, idx]);
  const hasArrows = total > 1;

  const prev = useCallback(() => setIdx((i) => (i - 1 + total) % total), [total]);
  const next = useCallback(() => setIdx((i) => (i + 1) % total), [total]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, prev, next, onClose]);

  useEffect(() => {
    onIndexChange?.(idx);
  }, [idx, onIndexChange]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1000]" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80" />
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div
          className="relative w-[90%] h-[90%] max-w-[600px] max-h-[700px] m-auto rounded-3xl"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className=" cursor-pointer absolute z-10 right-3 top-3 w-9 h-9 grid place-items-center rounded-full bg-black/50 text-white"
          >
            <span className="text-2xl leading-none mb-[10%]">×</span>
          </button>
          <figure className="relative w-full h-full overflow-hidden rounded-2xl">
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
          </figure>
        </div>
      </div>
    </div>,
    document.body
  );
}
