import { useTranslation } from 'react-i18next';
import onb1 from '../../../images/talent/onb1.png';
import onb2 from '../../../images/talent/onb2.png';

const TalentOnboardingSection = () => {
  const { t } = useTranslation();

  return (
    <section className="w-full flex flex-col gap-8 lg:gap-12">
      <div className="flex flex-col gap-8">
        <h2 className="text-3xl lg:text-4xl font-extrabold">{t('landing.talent.onboarding.header')}</h2>
        <p className="text-base">{t('landing.talent.onboarding.text')}</p>
      </div>

      <div className="w-full m-auto flex flex-col items-center gap-8 lg:flex-row lg:justify-around lg:max-w-[1250px]">
        <img src={onb1} alt="" className="w-full min-w-0 max-w-130 lg:flex-1" />
        <img src={onb2} alt="" className="w-full min-w-0 max-w-130 lg:flex-1" />
      </div>
    </section>
  );
};

export default TalentOnboardingSection;
