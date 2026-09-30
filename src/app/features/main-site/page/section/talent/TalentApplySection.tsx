import { Button } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../../../../shared/lib/routes';
import applyImg from '../../../images/talent/apply.png';

const TalentApplySection = () => {
  const { t } = useTranslation();

  return (
    <section className="w-full flex flex-col items-center gap-10 lg:gap-12">
      <div className="w-full flex flex-col items-start gap-4">
        <h2 className="text-3xl lg:text-4xl font-extrabold">{t('landing.talent.apply.header')}</h2>
        <p className="text-base">{t('landing.talent.apply.text')}</p>
      </div>

      <img src={applyImg} alt="" className="w-full h-auto max-w-[1024px]" />

      <Button variant="primary" asChild className="max-w-[250px]">
        <a href={ROUTES.AUTH_REGISTER} rel="noopener noreferrer">
          {t('landing.talent.apply.cta')}
        </a>
      </Button>
    </section>
  );
};

export default TalentApplySection;
