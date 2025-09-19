import { useTranslation } from 'react-i18next';
import Check from '../../../../shared/icons/check.svg';

const ServicesSection = () => {
  const { t } = useTranslation();

  return (
    <section className="w-full h-full bg-[var(--color-secondary-offwhite)] min-h-[70vh] grid place-items-center lg:min-h-[55vh]">
      <div className="w-[90%] max-w-[1450px] h-full py-15 flex flex-col gap-10 items-center lg:justify-center">
        {/* Title */}
        <h2 className="text-2xl font-bold lg:self-start lg:text-[40px]"> {t('landing.services.header')}</h2>
        {/* Content */}
        <div className="w-full flex flex-col gap-8 items-center lg:flex-row">
          <article className="w-full flex flex-col gap-4 bg-white rounded-2xl p-8">
            <div className="w-full flex flex-row items-center justify-between">
              <h2 className="text-lg font-bold">{t('landing.services.service1.title')}</h2>
              <img src={Check}></img>
            </div>
            <p className="text-sm font-normal">{t('landing.services.service1.description')}</p>
          </article>
          <article className="w-full flex flex-col gap-4 bg-white rounded-2xl p-8">
            <div className="w-full flex flex-row items-center justify-between">
              <h2 className="text-lg font-bold">{t('landing.services.service2.title')}</h2>
              <img src={Check}></img>
            </div>
            <p className="text-sm font-normal">{t('landing.services.service2.description')}</p>
          </article>
          <article className="w-full flex flex-col gap-4 bg-white rounded-2xl p-8">
            <div className="w-full flex flex-row items-center justify-between">
              <h2 className="text-lg font-bold">{t('landing.services.service3.title')}</h2>
              <img src={Check}></img>
            </div>
            <p className="text-sm font-normal">{t('landing.services.service3.description')}</p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
