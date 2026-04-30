import { Label } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { DashboardLoadingLabel, DashboardSection } from 'autocasting-ui-library-padimasso';
import { SectionTitle } from '../../../../../shared/components/Section';
import ServerError from '../../../../../shared/components/ServerError/ServerError';
import { useEmployerCastingIds } from '../../context/EmployerCastingContext';
import { useSectionCheckout } from '../../hooks/section/useSectionCheckout';
import CastingCheckoutPaymentForm from '../Form/Checkout/CastingCheckoutPaymentForm';
import CastingCheckoutSummaryForm from '../Form/Checkout/CastingCheckoutSummaryForm';

const EmployerCastingCheckoutEditSection = () => {
  const { t } = useTranslation();
  const { id: castingId } = useEmployerCastingIds();
  const { data, isLoading, error } = useSectionCheckout(castingId);

  if (isLoading || !data) {
    return (
      <DashboardSection>
        <DashboardLoadingLabel />
      </DashboardSection>
    );
  }
  if (error) return <ServerError />;

  return (
    <DashboardSection>
      <SectionTitle title={t('employer_castings.dashboard.checkout.checkout_and_publish')} />
      <Label className="mt-2 w-full text-[var(--color-secondary-grey-fonts)]">
        {t('employer_castings.dashboard.checkout.subtitle')}
      </Label>
      <div className="flex flex-col gap-6 w-full lg:flex-row lg:justify-between">
        <CastingCheckoutSummaryForm data={data} />
        <CastingCheckoutPaymentForm />
      </div>
    </DashboardSection>
  );
};

export default EmployerCastingCheckoutEditSection;
