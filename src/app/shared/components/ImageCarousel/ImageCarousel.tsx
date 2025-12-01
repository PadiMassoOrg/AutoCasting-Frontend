import { useEffect, useMemo, useState } from 'react';
import PLACEHOLDER_SVG from '../../../shared/icons/image_placeholder.svg';

type Props = {
  images: string[] | null;
  className?: string;
  isDesktop?: boolean; // LG
  isDesktopXL?: boolean; // XL
};

export default function ImageCarousel({ images, className, isDesktop, isDesktopXL }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const finalImages = useMemo<string[]>(() => {
    const MAX_SLOTS = 4;
    const base = (images ?? []).filter((src) => typeof src === 'string' && src.trim().length > 0).slice(0, MAX_SLOTS);
    const missing = MAX_SLOTS - base.length;
    if (missing <= 0) {
      return base;
    }
    return [...base, ...Array.from({ length: missing }, () => PLACEHOLDER_SVG)];
  }, [images]);

  useEffect(() => {
    if (selectedIndex >= finalImages.length) setSelectedIndex(0);
  }, [finalImages.length, selectedIndex]);

  const selectedImage = finalImages[selectedIndex];
  const rightThumbIndices = useMemo(() => finalImages.map((_, i) => i).slice(1, 4), [finalImages]);
  const isDesktopOnly = !!isDesktop && !isDesktopXL;
  const desktopLayout = !!isDesktop || !!isDesktopXL;
  const showDesktopThumbs = desktopLayout && finalImages.length > 1;

  const gridColsTwo = isDesktopOnly ? 'grid-cols-[1fr_130px]' : 'grid-cols-[max-content_auto]';
  const gridCols = showDesktopThumbs ? gridColsTwo : 'grid-cols-1';
  const figureClass = desktopLayout
    ? isDesktopOnly
      ? 'w-full h-full'
      : 'h-full [aspect-ratio:8/10]'
    : 'w-full aspect-[8/10]';
  const wrapperClass = desktopLayout
    ? `grid items-stretch min-h-0 h-full ${gridCols} grid-rows-[1fr_auto] gap-3`
    : 'flex flex-col gap-3 w-full';

  return (
    <div className={`w-full ${desktopLayout ? 'h-full min-h-0' : 'h-auto'} ${className ?? ''}`}>
      <div className={wrapperClass}>
        {/* principal */}
        <div className={desktopLayout ? 'col-[1] row-[1] h-full min-h-0 flex flex-col' : 'flex flex-col gap-2'}>
          <figure className={`relative overflow-hidden rounded-xl ${figureClass}`}>
            <img
              src={selectedImage}
              alt={`Imagen ${selectedIndex + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </figure>

          {!desktopLayout && finalImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto w-full">
              {finalImages.slice(1).map((img, i) => (
                <button
                  key={`thumb-m-${i}`}
                  type="button"
                  aria-label={`Ver imagen ${i + 1}`}
                  className="w-[120px] aspect-[8/10] flex-shrink-0 rounded-lg overflow-hidden border-2 border-transparent"
                >
                  <img src={img} alt={`Miniatura ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {showDesktopThumbs && (
          <div
            className="col-[2] row-[1] h-full min-h-0 flex flex-col gap-2 items-stretch justify-center"
            style={{ ['--g' as any]: '12px' }}
          >
            {rightThumbIndices.map((idx) => {
              const img = finalImages[idx];
              return (
                <button
                  key={`thumb-d-${idx}`}
                  type="button"
                  aria-label={`Ver imagen ${idx + 1}`}
                  style={{ height: 'calc((100% - 2*var(--g)) / 3)' }}
                  className="relative aspect-[4/5] rounded-xl overflow-hidden border-2 border-transparent flex-shrink-0"
                >
                  <img src={img} alt={`Miniatura ${idx + 1}`} className="absolute inset-0 w-full h-full object-cover" />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
