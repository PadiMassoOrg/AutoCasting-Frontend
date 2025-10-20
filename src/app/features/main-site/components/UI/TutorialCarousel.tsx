import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

type StepKey = 'step1' | 'step2' | 'step3';
export type TutorialStep = {
  key: StepKey; // 'step1' | 'step2' | 'step3'
  image: string; // import img from '...';  -> pásalo aquí
  alt?: string;
};

export default function TutorialCarousel({ steps }: { steps: TutorialStep[] }) {
  const { t } = useTranslation();
  const [idx, setIdx] = useState(0);

  const go = (n: number) => setIdx((p) => (p + n + steps.length) % steps.length);
  const goTo = (n: number) => setIdx(n);

  // teclado ← →
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // swipe básico
  const touchX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => (touchX.current = e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(delta) < 30) return;
    if (delta > 0) go(-1);
    else go(1);
  };

  const step = steps[idx];

  return (
    <div
      className="lg:hidden w-full relative flex flex-col items-center gap-8 px-6 py-8 rounded-[20px] bg-white/50 overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
    >
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label={t('common.prev') ?? 'Anterior'}
          className="cursor-pointer grid h-8 w-8 place-items-center rounded-full"
        >
          <ChevronLeft />
        </button>

        <div className="flex items-center gap-2">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`${t('common.slide') ?? 'Slide'} ${i + 1}`}
              className={`cursor-pointer h-2.5 w-2.5 rounded-full transition
                ${i === idx ? 'bg-black w-[14px] h-[14px]' : 'bg-black/20'}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label={t('common.next') ?? 'Siguiente'}
          className="cursor-pointer grid h-8 w-8 place-items-center rounded-full"
        >
          <ChevronRight />
        </button>
      </div>

      {/* Panel */}
      <div className="w-full flex flex-col gap-4 px-3 min-h-[485px] max-h-[485px] ">
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-extrabold">{t(`landing.tutorial.${step.key}.title`)}</h3>
          <p className="text-sm font-base">{t(`landing.tutorial.${step.key}.description`)}</p>
        </div>

        <figure className={`overflow-hidden bg-transparent ${idx === 0 ? 'mr-[-36px]' : ''}`}>
          <img
            src={step.image}
            alt={step.alt ?? t(`landing.tutorial.${step.key}.title`)}
            className="w-full h-auto block object-cover"
            draggable={false}
          />
        </figure>
      </div>
    </div>
  );
}

function ChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
