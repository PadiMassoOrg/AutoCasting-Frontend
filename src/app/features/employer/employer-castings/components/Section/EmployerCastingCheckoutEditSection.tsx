import { DashboardLoadingLabel, Label } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import ServerError from '../../../../../shared/components/ServerError/ServerError';
import { useEmployerCastingIds } from '../../context/EmployerCastingContext';
import { useSectionCheckout } from '../../hooks/section/useSectionCheckout';
import CastingCheckoutPaymentForm from '../Form/Checkout/CastingCheckoutPaymentForm';
import CastingCheckoutSummaryForm from '../Form/Checkout/CastingCheckoutSummaryForm';

const EmployerCastingCheckoutEditSection = () => {
  const { t } = useTranslation();
  const { id: castingId } = useEmployerCastingIds();
  const { data, isLoading, error } = useSectionCheckout(castingId);

  if (isLoading || !data) return <DashboardLoadingLabel />;
  if (error) return <ServerError />;

  return (
    <article className="flex flex-col gap-8">
      <Label className="w-full text-[var(--color-secondary-grey-fonts)]">
        {t('employer_castings.dashboard.checkout.subtitle')}
      </Label>
      <div className="flex w-full flex-col gap-6 lg:flex-row lg:justify-between">
        <CastingCheckoutSummaryForm data={data} />
        <CastingCheckoutPaymentForm />
      </div>
    </article>
  );
};

export default EmployerCastingCheckoutEditSection;
