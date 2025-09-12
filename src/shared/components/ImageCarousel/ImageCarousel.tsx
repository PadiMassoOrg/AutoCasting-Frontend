import { Button } from 'autocasting-ui-library-padimasso';
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

  const gridCols = isDesktopOnly
    ? 'grid-cols-[1fr_130px]' // LG
    : 'grid-cols-[max-content_130px]'; // XL

  const figureClass = desktopLayout
    ? isDesktopOnly
      ? 'w-full h-full'
      : 'h-full [aspect-ratio:8/10]'
    : 'w-full aspect-[8/10]';

  // 👇 NUEVO: clases del wrapper según layout
  const wrapperClass = desktopLayout
    ? `grid items-stretch min-h-0 h-full ${gridCols} grid-rows-[1fr_auto] gap-x-4 gap-y-3`
    : 'flex flex-col gap-3 w-full';

  return (
    <div className={`w-full ${desktopLayout ? 'h-full min-h-0' : 'h-auto'} ${className ?? ''}`}>
      {/* ⬇️ usar wrapperClass en lugar de grid fijo */}
      <div className={wrapperClass}>
        {/* izquierda */}
        <div className={desktopLayout ? 'col-[1] row-[1] h-full min-h-0 flex flex-col' : 'flex flex-col gap-2'}>
          <figure className={`relative overflow-hidden rounded-xl shadow-md ${figureClass}`}>
            <img
              src={selectedImage}
              alt={`Imagen ${selectedIndex + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </figure>

          {/* Thumbs horizontales SOLO mobile */}
          {!desktopLayout && (
            <div className="flex gap-2 overflow-x-auto w-full pb-1">
              {finalImages.map((img, i) => (
                <button
                  key={`thumb-m-${i}`}
                  type="button"
                  onClick={() => setSelectedIndex(i)}
                  aria-label={`Seleccionar imagen ${i + 1}`}
                  className={`cursor-pointer w-[120px] aspect-[8/10] flex-shrink-0 rounded-lg overflow-hidden border-2 ${
                    selectedIndex === i ? 'border-blue-500' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt={`Miniatura ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* derecha (solo desktop) */}
        {desktopLayout && (
          <div className="col-[2] row-[1] h-full min-h-0 overflow-hidden grid grid-rows-[repeat(3,minmax(0,1fr))] gap-4">
            {rightThumbIndices.map((idx) => (
              <button
                key={`thumb-d-${idx}`}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                aria-label={`Seleccionar imagen ${idx + 1}`}
                className={`relative w-full h-full rounded-xl overflow-hidden border-2 ${
                  selectedIndex === idx ? 'border-blue-500' : 'border-transparent'
                }`}
              >
                <img
                  src={finalImages[idx]}
                  alt={`Miniatura ${idx + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* botón sólo desktop */}
        {desktopLayout && (
          <div className="col-[1/-1] row-[2]">
            <Button variant="outline" className="w-full">
              Ver Más Fotos
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
