import { useTranslation } from 'react-i18next';
import { TutorialCarousel } from '../../components/UI';
import type { TutorialStep } from '../../components/UI/TutorialCarousel';
import step1Img from '../../images/tutorial_step1.png';
import step2Img from '../../images/tutorial_step2.png';
import step3Img from '../../images/tutorial_step3.png';

const TutorialSection = () => {
  const { t } = useTranslation();

  const steps: TutorialStep[] = [
    { key: 'step1', image: step1Img, alt: 'Editor de perfil' },
    { key: 'step2', image: step2Img, alt: 'Compartir link' },
    { key: 'step3', image: step3Img, alt: 'Contactos y casting' },
  ];

  return (
    <section className="w-full bg-[var(--color-secondary-offwhite)] min-h-[85vh] grid place-items-center">
      <div className="w-[90%] max-w-[1450px] h-full py-15 flex flex-col gap-10 items-center">
        {/* Title */}
        <h2 className="text-2xl font-bold lg:self-start lg:text-[40px]"> {t('landing.tutorial.header')}</h2>
        {/* Content */}
        <TutorialCarousel steps={steps} />
        <article className="hidden w-full relative lg:grid grid-cols-3 items-center gap-6">
          {steps.map((step, idx) => {
            return (
              <div key={step.key} className="h-full px-6 py-10 rounded-[20px] bg-white/50 overflow-hidden">
                <div className="w-full flex flex-col gap-4 px-3">
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
          })}
        </article>
      </div>
    </section>
  );
};

export default TutorialSection;
