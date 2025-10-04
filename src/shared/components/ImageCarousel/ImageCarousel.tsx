import { Button } from 'autocasting-ui-library-padimasso';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PLACEHOLDER_SVG from '../../../shared/icons/image_placeholder.svg';
import PhotoZoomOverlay from '../PhotoZoomOverlay/PhotoZoomOverlay';

type Props = {
  images: string[] | null;
  className?: string;
  isDesktop?: boolean; // LG
  isDesktopXL?: boolean; // XL
};

export default function ImageCarousel({ images, className, isDesktop, isDesktopXL }: Props) {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  const openZoom = () => setZoomOpen(true);
  const closeZoom = () => setZoomOpen(false);

  const finalImages = useMemo<string[]>(() => {
    if (!images || images.length === 0) return Array.from({ length: 4 }, () => PLACEHOLDER_SVG);
    return images;
  }, [images]);

  useEffect(() => {
    if (selectedIndex >= finalImages.length) setSelectedIndex(0);
  }, [finalImages.length, selectedIndex]);

  const selectedImage = finalImages[selectedIndex];
  const rightThumbIndices = useMemo(() => finalImages.map((_, i) => i).slice(0, 3), [finalImages]);

  const isDesktopOnly = !!isDesktop && !isDesktopXL;
  const desktopLayout = !!isDesktop || !!isDesktopXL;

  // ✅ mostrar thumbs sólo si hay >1 imagen real en desktop
  const realCount = images?.length ?? 0;
  const showDesktopThumbs = desktopLayout && realCount > 1;

  // === geometría ORIGINAL (sin cambios para la figura/contenedor) ===
  const gridColsTwo = isDesktopOnly ? 'grid-cols-[1fr_130px]' : 'grid-cols-[max-content_auto]';
  const gridCols = showDesktopThumbs ? gridColsTwo : 'grid-cols-1';

  const figureClass = desktopLayout
    ? isDesktopOnly
      ? 'w-full h-full'
      : 'h-full [aspect-ratio:8/10]'
    : 'w-full aspect-[8/10]';

  const wrapperClass = desktopLayout
    ? `grid items-stretch min-h-0 h-full ${gridCols} grid-rows-[1fr_auto] gap-x-4 gap-y-3`
    : 'flex flex-col gap-3 w-full';

  return (
    <div className={`w-full ${desktopLayout ? 'h-full min-h-0' : 'h-auto'} ${className ?? ''}`}>
      <div className={wrapperClass}>
        {/* principal */}
        <div className={desktopLayout ? 'col-[1] row-[1] h-full min-h-0 flex flex-col' : 'flex flex-col gap-2'}>
          <figure className={`cursor-pointer relative overflow-hidden rounded-xl ${figureClass}`} onClick={openZoom}>
            <img
              src={selectedImage}
              alt={`Imagen ${selectedIndex + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </figure>

          {/* thumbs mobile (sin cambios) */}
          {!desktopLayout && realCount > 1 && (
            <div className="flex gap-2 overflow-x-auto w-full pb-1">
              {finalImages.map((img, i) => (
                <button
                  key={`thumb-m-${i}`}
                  type="button"
                  onClick={() => setSelectedIndex(i)}
                  aria-label={`Seleccionar imagen ${i + 1}`}
                  className={`cursor-pointer w-[120px] aspect-[8/10] flex-shrink-0 rounded-lg overflow-hidden border-2 ${
                    selectedIndex === i ? 'border-[var(--color-primary-greenyellow)]' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt={`Miniatura ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ✅ thumbs desktop: HIDDEN si images.length === 1 */}
        {showDesktopThumbs && (
          <div
            className="col-[2] row-[1] h-full min-h-0 flex flex-col gap-3 items-stretch"
            style={{ ['--g' as any]: '12px' }}
          >
            {rightThumbIndices.map((idx) => {
              const img = finalImages[idx];
              const selected = selectedIndex === idx;
              return (
                <button
                  key={`thumb-d-${idx}`}
                  type="button"
                  onClick={() => setSelectedIndex(idx)} // (tu comportamiento original)
                  aria-label={`Seleccionar imagen ${idx + 1}`}
                  style={{ height: 'calc((100% - 2*var(--g)) / 3)' }}
                  className={`cursor-pointer relative aspect-[4/5] rounded-xl overflow-hidden border-2 flex-shrink-0 ${
                    selected ? 'border-blue-500' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt={`Miniatura ${idx + 1}`} className="absolute inset-0 w-full h-full object-cover" />
                </button>
              );
            })}
          </div>
        )}

        {/* botón */}
        <div className={desktopLayout ? 'col-[1/-1] row-[2]' : ''}>
          <Button variant="outline" className="w-full" onClick={openZoom}>
            {t('profile.media.more_photos')}
          </Button>
        </div>

        {/* Overlay */}
        <PhotoZoomOverlay open={zoomOpen} images={finalImages} initialIndex={selectedIndex} onClose={closeZoom} />
      </div>
    </div>
  );
}
