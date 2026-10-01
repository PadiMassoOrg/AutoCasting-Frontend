import { useTranslation } from 'react-i18next';
import createCasting1 from '../../../images/employer/create_casting1.png';
import createCasting2 from '../../../images/employer/create_casting2.png';
import createCasting3 from '../../../images/employer/create_casting3.png';

const EmployerCreateCastingSection = () => {
  const { t } = useTranslation();

  return (
    <section className="w-full flex flex-col items-center gap-10 lg:gap-20">
      <div className="w-full flex flex-col gap-8">
        <h2 className="text-3xl lg:text-4xl font-extrabold">{t('landing.employer.createCasting.header')}</h2>
        <p className="text-base">{t('landing.employer.createCasting.text')}</p>
      </div>

      {/* Step 1 */}
      <article className="w-full flex flex-col gap-10 lg:gap-16 items-center">
        <div className="w-full flex flex-col items-start gap-4">
          <h3 className="text-xl lg:text-2xl font-extrabold">• {t('landing.employer.createCasting.step1.title')}</h3>
          <p className="text-base">{t('landing.employer.createCasting.step1.text')}</p>
        </div>

        <img src={createCasting1} alt="" className="w-full h-auto max-w-[1024px]" />
      </article>

      {/* Step 2 */}
      <article className="w-full flex flex-col gap-10 lg:gap-16 items-center">
        <div className="w-full flex flex-col items-start gap-4">
          <h3 className="text-xl lg:text-2xl font-extrabold">• {t('landing.employer.createCasting.step2.title')}</h3>
          <p className="text-base">{t('landing.employer.createCasting.step2.text')}</p>
        </div>

        <img src={createCasting2} alt="" className="w-full h-auto max-w-[1024px]" />
      </article>

      {/* Step 3 */}
      <article className="w-full flex flex-col gap-10 lg:gap-16 items-center">
        <div className="w-full flex flex-col items-start gap-4">
          <h3 className="text-xl lg:text-2xl font-extrabold">• {t('landing.employer.createCasting.step3.title')}</h3>
          <p className="text-base">{t('landing.employer.createCasting.step3.text')}</p>
        </div>

        <img src={createCasting3} alt="" className="w-full h-auto max-w-[1024px]" />
      </article>
    </section>
  );
};

export default EmployerCreateCastingSection;
