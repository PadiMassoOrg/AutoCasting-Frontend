import { Button } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../../../../shared/lib/routes';
import catalogImg from '../../../images/talent/catalog.png';

const TalentCatalogSection = () => {
  const { t } = useTranslation();

  return (
    <section className="w-full flex flex-col gap-8 lg:gap-12 lg:py-20">
      <div className="w-full flex flex-col gap-10 items-center lg:flex-row">
        <article className="w-full flex flex-col items-start gap-6 lg:flex-1">
          <h2 className="text-xl lg:text-3xl lg:text-4xl font-extrabold">{t('landing.talent.catalog.header')}</h2>
          <p className="text-base">{t('landing.talent.catalog.text')}</p>
          <Button variant="primary" asChild className="max-w-[250px] m-auto mt-8 mb-6 lg:m-0">
            <a href={ROUTES.AUTH_REGISTER} rel="noopener noreferrer">
              {t('landing.talent.catalog.cta')}
            </a>
          </Button>
        </article>

        <img src={catalogImg} alt="" className="w-full min-w-0 max-w-130 lg:flex-1" />
      </div>
    </section>
  );
};

export default TalentCatalogSection;
