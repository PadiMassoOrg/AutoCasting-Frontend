import { Button } from 'autocasting-ui-library-padimasso';
import { useEffect, useMemo, useState } from 'react';
import PLACEHOLDER_SVG from '../../../shared/icons/image_placeholder.svg';

type Props = {
  images: string[] | null;
  className?: string;
};

export default function ImageCarousel({ images, className }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const finalImages = useMemo<string[]>(() => {
    if (!images || images.length === 0) return Array.from({ length: 4 }, () => PLACEHOLDER_SVG);
    return images;
  }, [images]);

  useEffect(() => {
    if (selectedIndex >= finalImages.length) setSelectedIndex(0);
  }, [finalImages.length, selectedIndex]);

  const selectedImage = finalImages[selectedIndex];
  const rightThumbIndices = useMemo(
    () => finalImages.map((_, i) => i).slice(0, 3), // máx 3
    [finalImages]
  );

  return (
    <div className={`w-full h-full min-h-0 ${className ?? ''}`}>
      <div
        className="
        flex flex-col gap-3
        lg:grid lg:h-full lg:min-h-0 lg:items-stretch
        lg:grid-cols-[1fr_130px] lg:grid-rows-[1fr_auto] lg:gap-x-4 lg:gap-y-3
      "
      >
        <div className="min-h-0 gap-4 lg:col-[1] lg:row-[1] lg:h-full flex flex-col">
          {/* Selected Image */}
          <figure
            className="relative w-full overflow-hidden rounded-xl shadow-md
                            aspect-[8/10] lg:aspect-auto lg:h-full"
          >
            <img
              src={selectedImage}
              alt={`Imagen ${selectedIndex + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </figure>

          {/* Mobile Thumbs */}
          <div className="flex gap-[8px] overflow-x-auto w-full lg:hidden">
            {finalImages.map((img, index) => (
              <button
                key={`${img}-${index}`}
                className={`cursor-pointer w-34 aspect-[8/10] flex-shrink-0 rounded-lg overflow-hidden border-2 ${
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
        </div>

        {/* Desktop Thumbs */}
        <div
          className="
          hidden lg:grid lg:col-[2] lg:row-[1]
          lg:h-full lg:min-h-0 lg:overflow-hidden
          lg:grid-rows-[repeat(3,minmax(0,1fr))] lg:gap-4
        "
        >
          {rightThumbIndices.map((idx) => {
            const img = finalImages[idx];
            const selected = selectedIndex === idx;
            return (
              <button
                key={`${img}-${idx}`}
                className={`cursor-pointer relative rounded-xl overflow-hidden border-2 ${
                  selected ? 'border-blue-500' : 'border-transparent'
                }`}
                onClick={() => setSelectedIndex(idx)}
                aria-label={`Seleccionar imagen ${idx + 1}`}
                type="button"
              >
                <img src={img} alt={`Miniatura ${idx + 1}`} className="absolute inset-0 w-full h-full object-cover" />
                {/* forzar a ocupar el alto de su fila */}
                <div className="pt-[100%] opacity-0" />
              </button>
            );
          })}
        </div>

        <div className="hidden lg:block lg:col-[1/-1] lg:row-[2]">
          <Button variant="outline">Ver Más Fotos</Button>
        </div>
      </div>
    </div>
  );
}
