import { Button } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../../../../shared/lib/routes';
import manageCasting1 from '../../../images/employer/manage_casting1.png';
import manageCasting2 from '../../../images/employer/manage_casting2.png';

const CARD_KEYS = ['card1', 'card2', 'card3'] as const;

const EmployerManageCastingSection = () => {
  const { t } = useTranslation();

  return (
    <section className="w-full flex flex-col items-center">
      <article className="flex flex-col h-[70vh] lg:h-[50vh] items-center justify-around">
        <h2 className="w-full text-center text-3xl lg:text-4xl font-extrabold">
          {t('landing.employer.manage.header')}
        </h2>

        <div className="w-full max-w-[1024px] grid grid-cols-1 gap-8 lg:gap-6 lg:grid-cols-3">
          {CARD_KEYS.map((key) => (
            <article
              key={key}
              className="flex flex-col gap-4 rounded-3xl border border-(--color-secondary-outline) p-8 lg:p-9"
            >
              <h3 className="text-lg font-bold">{t(`landing.employer.manage.${key}.title`)}</h3>
              <p className="text-base">{t(`landing.employer.manage.${key}.text`)}</p>
            </article>
          ))}
        </div>
      </article>

      <article className="flex flex-col gap-12 items-center">
        <div className="w-full flex flex-col items-center gap-10 lg:gap-14">
          <img src={manageCasting1} alt="" className="w-full h-auto max-w-[1024px]" />
          <img src={manageCasting2} alt="" className="w-full h-auto max-w-[1024px]" />
        </div>

        <Button variant="primary" asChild className="max-w-[250px] m-auto my-6 lg:m-0">
          <a href={ROUTES.AUTH_REGISTER} rel="noopener noreferrer">
            {t('landing.talent.catalog.cta')}
          </a>
        </Button>
      </article>
    </section>
  );
};

export default EmployerManageCastingSection;
