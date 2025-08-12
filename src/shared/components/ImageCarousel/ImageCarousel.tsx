import { useState } from 'react';

type Props = {
  images: string[];
};

export default function ImageCarousel({ images }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images[selectedIndex];

  if (!images || images.length === 0) {
    return <div className="text-center text-gray-500">No hay imágenes disponibles.</div>;
  }

  return (
    <div className="w-full flex flex-col items-center gap-[10px]">
      {/* Imagen Principal */}
      <div className="w-full aspect-[8/10] overflow-hidden rounded-xl shadow-md">
        <img src={selectedImage} alt={`Imagen ${selectedIndex + 1}`} className="w-full h-full object-cover" />
      </div>

      {/* Slider de thumbnails */}
      <div className="flex gap-[8px] overflow-x-auto w-full">
        {images.map((img, index) => (
          <button
            key={index}
            className={`w-34 aspect-[8/10] flex-shrink-0 rounded-lg overflow-hidden border-2 ${
              selectedIndex === index ? 'border-blue-500' : 'border-transparent'
            }`}
            onClick={() => setSelectedIndex(index)}
          >
            <img src={img} alt={`Miniatura ${index + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
