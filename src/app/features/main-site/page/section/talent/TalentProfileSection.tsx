import { Button } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../../../../shared/lib/routes';
import edit1 from '../../../images/talent/edit1.png';
import edit2 from '../../../images/talent/edit2.png';

const TalentProfileSection = () => {
  const { t } = useTranslation();

  return (
    <section className="w-full flex flex-col items-center gap-10 lg:gap-12">
      <div className="w-full flex flex-col items-start gap-4">
        <h2 className="text-3xl lg:text-4xl font-extrabold">{t('landing.talent.profile.header')}</h2>
        <p className="text-base">{t('landing.talent.profile.text')}</p>
      </div>

      <div className="w-full flex flex-col items-center gap-10 lg:gap-14">
        <img src={edit1} alt="" className="w-full h-auto max-w-[1024px]" />
        <img src={edit2} alt="" className="w-full h-auto max-w-[1024px]" />
      </div>

      <Button variant="primary" asChild className="max-w-[250px]">
        <a href={ROUTES.AUTH_REGISTER} rel="noopener noreferrer">
          {t('landing.talent.profile.cta')}
        </a>
      </Button>
    </section>
  );
};

export default TalentProfileSection;
