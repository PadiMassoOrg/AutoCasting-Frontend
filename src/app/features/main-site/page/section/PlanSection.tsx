import { Icon } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { PlanCard } from '../../components/UI';

const PlanSection = () => {
  const { t } = useTranslation();

  return (
    <section className="w-full relative bg-[var(--color-primary-white)] min-h-[82vh] grid place-items-center">
      <div className="relative max-w-[1450px] z-10 w-[90%] h-full py-15 flex flex-col gap-10 lg:gap-14 items-center">
        {/* Title */}
        <div className="flex flex-col gap-2 items-center">
          <Icon name="ogIcon" className="w-18"></Icon>
          <h2 className="text-2xl font-bold lg:text-[40px]">{t('landing.plan.header')}</h2>
        </div>

        {/* Content */}
        <div className="w-full flex flex-col items-center gap-10 lg:grid lg:grid-cols-2 lg:max-w-[800px]">
          <PlanCard planKey="free" benefits={3} ctaVariant="primary" />
          <PlanCard planKey="pro" benefits={3} ctaVariant="primary" recommended />
        </div>
      </div>
    </section>
  );
};

export default PlanSection;
