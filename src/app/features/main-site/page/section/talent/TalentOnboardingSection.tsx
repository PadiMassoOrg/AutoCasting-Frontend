import { useTranslation } from 'react-i18next';
import onb1 from '../../../images/talent/onb1.png';
import onb2 from '../../../images/talent/onb2.png';

const TalentOnboardingSection = () => {
  const { t } = useTranslation();

  return (
    <section className="w-full flex flex-col gap-4 py-14 lg:gap-12">
      <div className="flex flex-col gap-8">
        <h2 className="text-3xl lg:text-4xl font-extrabold">{t('landing.talent.onboarding.header')}</h2>
        <p className="text-base">{t('landing.talent.onboarding.text')}</p>
      </div>

      <div className="w-full flex flex-col items-center gap-4 lg:flex-row lg:justify-between">
        <img src={onb1} alt="" />
        <img src={onb2} alt="" />
      </div>
    </section>
  );
};

export default TalentOnboardingSection;
