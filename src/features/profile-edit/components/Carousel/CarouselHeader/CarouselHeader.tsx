import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from '../../../../../shared/components/Chevron';
import HilighterSvg from '../../../../../shared/icons/HilighterSvg';
export type HeaderItem = { key: string; label: string };

export default function CarouselHeader({
  items,
  active,
  onChange,
}: {
  items: HeaderItem[];
  active: number;
  onChange: (index: number) => void;
}) {
  const { t } = useTranslation();
  const canPrev = active > 0;
  const canNext = active < items.length - 1;

  const prev = () => canPrev && onChange(active - 1);
  const next = () => canNext && onChange(active + 1);

  return (
    <div
      className={`
        w-full
        lg:w-auto
      `}
    >
      {/* HORIZONTAL */}
      <article className="w-full lg:hidden">
        {/* Dots */}
        <div className="flex items-center gap-2 justify-center mb-6">
          {items.map((_, i) => (
            <span
              key={i}
              aria-label={`Ir a ${items[i].label}`}
              onClick={() => onChange(i)}
              className={`cursor-pointer h-2.5 w-2.5 rounded-full transition-colors ${i === active ? 'bg-black w-4 h-4' : 'bg-gray-300'}`}
            />
          ))}
        </div>
        {/* Title + Chevron */}
        <div className="w-full flex flex-row items-center justify-between">
          <span
            onClick={prev}
            aria-label="Anterior"
            className={`p-2 rounded-full transition-opacity ${
              canPrev ? 'opacity-100' : 'opacity-30 pointer-events-none'
            }`}
          >
            <ChevronLeft />
          </span>

          <div className="relative inline-flex items-center justify-center min-h-[50px] isolation-auto">
            <div className="text-2xl font-bold relative z-10">{items[active]?.label}</div>
            <HilighterSvg
              width={110}
              height={56}
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"
            />
          </div>

          <span
            onClick={next}
            aria-label="Siguiente"
            className={`p-2 rounded-full transition-opacity ${
              canNext ? 'opacity-100' : 'opacity-30 pointer-events-none'
            }`}
          >
            <ChevronRight />
          </span>
        </div>
      </article>

      {/* VERTICAL */}
      <article className="hidden lg:relative lg:flex lg:flex-col lg:w-[264px] lg:h-full lg:gap-20 lg:py-4">
        <span className="absolute top-0 right-0 h-full border-r-1 border-black/20"></span>
        {/* Main Title */}
        <div className="w-full">
          <h2 className="font-bold text-base">{t('profile.page.edit_profile')}</h2>
        </div>
        {/* Carousel Menu */}
        <article>
          <div className="w-full flex flex-row justify-around">
            <div className="relative inline-flex items-center justify-center min-h-[50px] isolation-auto">
              <div className="text-2xl font-bold relative z-10">{items[active]?.label}</div>
              <HilighterSvg
                width={110}
                height={56}
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"
              />
            </div>
          </div>
        </article>
      </article>
    </div>
  );
}
