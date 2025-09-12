import { Button } from 'autocasting-ui-library-padimasso';
import { useEffect, useMemo, useState } from 'react';
import PLACEHOLDER_SVG from '../../../shared/icons/image_placeholder.svg';

type Props = {
  images: string[] | null;
  className?: string;
  isDesktop?: boolean; // LG
  isDesktopXL?: boolean; // XL (sólo para decidir layout; la altura la maneja el padre)
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
  const desktopLayout = !!isDesktop || !!isDesktopXL;

  return (
    <div className={`w-full ${desktopLayout ? 'h-full min-h-0' : 'h-auto'} ${className ?? ''}`}>
      <div
        className={
          desktopLayout
            ? 'grid items-stretch min-h-0 h-full grid-cols-[1fr_130px] grid-rows-[1fr_auto] gap-x-4 gap-y-3'
            : 'flex flex-col gap-3'
        }
      >
        {/* Izquierda (imagen seleccionada) */}
        <div className={desktopLayout ? 'col-[1] row-[1] h-full min-h-0 flex flex-col' : 'flex flex-col gap-2'}>
          <figure
            className={[
              'relative w-full overflow-hidden rounded-xl shadow-md',
              desktopLayout ? 'h-full' : 'aspect-[8/10]',
            ].join(' ')}
          >
            <img
              src={selectedImage}
              alt={`Imagen ${selectedIndex + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </figure>

          {/* Thumbs horizontales SOLO mobile */}
          {!desktopLayout && (
            <div className="flex gap-2 overflow-x-auto w-full pb-1">
              {finalImages.map((img, index) => (
                <button
                  key={`${img}-${index}`}
                  className={`cursor-pointer w-[120px] aspect-[8/10] flex-shrink-0 rounded-lg overflow-hidden border-2 ${
                    selectedIndex === index ? 'border-blue-500' : 'border-transparent'
                  }`}
                  onClick={() => setSelectedIndex(index)}
                  aria-label={`Seleccionar imagen ${index + 1}`}
                  type="button"
                >
                  <img src={img} alt={`Miniatura ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Derecha (3 thumbs = misma altura que la imagen) */}
        {desktopLayout && (
          <div className="col-[2] row-[1] h-full min-h-0 overflow-hidden grid grid-rows-[repeat(3,minmax(0,1fr))] gap-4">
            {rightThumbIndices.map((idx) => {
              const img = finalImages[idx];
              const selected = selectedIndex === idx;
              return (
                <button
                  key={`${img}-${idx}`}
                  className={`relative w-full h-full rounded-xl overflow-hidden border-2 ${selected ? 'border-blue-500' : 'border-transparent'}`}
                  onClick={() => setSelectedIndex(idx)}
                  aria-label={`Seleccionar imagen ${idx + 1}`}
                  type="button"
                >
                  <img src={img} alt={`Miniatura ${idx + 1}`} className="absolute inset-0 w-full h-full object-cover" />
                </button>
              );
            })}
          </div>
        )}

        {/* Botón: SOLO desktop (oculto en mobile) y ocupa toda la fila inferior */}
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
