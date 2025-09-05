import { useEffect, useMemo, useState } from 'react';
import PLACEHOLDER_SVG from '../../../shared/icons/image_placeholder.svg';

type Props = {
  images: string[] | null;
};

export default function ImageCarousel({ images }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const finalImages = useMemo<string[]>(() => {
    if (!images || images.length === 0) {
      return Array.from({ length: 4 }, () => PLACEHOLDER_SVG);
    }
    return images;
  }, [images]);

  useEffect(() => {
    if (selectedIndex >= finalImages.length) {
      setSelectedIndex(0);
    }
  }, [finalImages.length, selectedIndex]);

  const selectedImage = finalImages[selectedIndex];

  const rightThumbIndices = useMemo(() => {
    return finalImages.map((_, idx) => idx).slice(0, 3);
  }, [finalImages]);

  return (
    <div className="w-full flex flex-col items-center gap-[10px] lg:flex-row lg:items-stretch lg:gap-4">
      <div className="w-full aspect-[8/10] overflow-hidden rounded-xl shadow-md">
        <img src={selectedImage} alt={`Imagen ${selectedIndex + 1}`} className="w-full h-full object-cover" />
      </div>

      <div className="flex gap-[8px] overflow-x-auto w-full lg:hidden">
        {finalImages.map((img, index) => (
          <button
            key={`${img}-${index}`}
            className={`w-34 aspect-[8/10] cursor-pointer flex-shrink-0 rounded-lg overflow-hidden border-2 ${
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

      <div className="hidden lg:grid lg:grid-rows-3 lg:gap-2 lg:self-stretch lg:max-w-[130px]">
        {rightThumbIndices.map((idx) => {
          const img = finalImages[idx];
          const selected = selectedIndex === idx;
          return (
            <button
              key={`${img}-${idx}`}
              className={`relative cursor-pointer rounded-lg overflow-hidden border-2 ${selected ? 'border-blue-500' : 'border-transparent'}`}
              onClick={() => setSelectedIndex(idx)}
              aria-label={`Seleccionar imagen ${idx + 1}`}
              type="button"
            >
              <div className="w-full h-full">
                <img src={img} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
