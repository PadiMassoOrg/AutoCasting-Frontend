import { useEffect, useMemo, useState } from 'react';
import PLACEHOLDER_SVG from '../../../shared/icons/image_placeholder.svg';

type Props = {
  images: string[] | null;
};

export default function ImageCarousel({ images }: Props) {
  // Construimos el set final: reales o 4 placeholders
  const finalImages = useMemo<string[]>(() => {
    if (!images || images.length === 0) {
      return Array.from({ length: 4 }, () => PLACEHOLDER_SVG);
    }
    return images;
  }, [images]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  // Si cambia la cantidad (o pasa de 0 a placeholders), mantenemos el índice en rango
  useEffect(() => {
    if (selectedIndex >= finalImages.length) {
      setSelectedIndex(0);
    }
  }, [finalImages.length, selectedIndex]);

  const selectedImage = finalImages[selectedIndex];

  return (
    <div className="w-full flex flex-col items-center gap-[10px]">
      {/* Imagen Principal */}
      <div className="w-full aspect-[8/10] overflow-hidden rounded-xl shadow-md">
        <img src={selectedImage} alt={`Imagen ${selectedIndex + 1}`} className="w-full h-full object-cover" />
      </div>

      {/* Slider de thumbnails */}
      <div className="flex gap-[8px] overflow-x-auto w-full">
        {finalImages.map((img, index) => (
          <button
            key={`${img}-${index}`}
            className={`w-34 aspect-[8/10] flex-shrink-0 rounded-lg overflow-hidden border-2 ${
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
  );
}
