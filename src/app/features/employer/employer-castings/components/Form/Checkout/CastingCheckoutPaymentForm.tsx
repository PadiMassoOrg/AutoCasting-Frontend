import { Button, Separator } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SectionCard } from '../../../../../../shared/components/Section';
import { ROUTES } from '../../../../../../shared/lib/routes';
import { CASTING_STATUS_PUBLISHED } from '../../../../../sitemetadata/utils/siteMetadataUtils';
import { useEmployerCastingIds, useEmployerCastingPublishAllowed } from '../../../context/EmployerCastingContext';
import { useCastingStatusActions } from '../../../hooks/status/useCastingStatusActions';

const CastingCheckoutPaymentForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id: castingId, defaultCode } = useEmployerCastingIds();
  const { setStatusByCode, isPending: isStatusPending } = useCastingStatusActions();
  const publishAllowed = useEmployerCastingPublishAllowed();

  const handlePublishCasting = async () => {
    if (!publishAllowed || isStatusPending) return;
    await setStatusByCode(CASTING_STATUS_PUBLISHED, { id: castingId, slug: defaultCode });
    navigate(ROUTES.EMPLOYER_CASTINGS);
  };

  return (
    <SectionCard className="w-full h-full">
      <article className="mb-10">
        <h2 className="text-base font-semibold">{t('employer_castings.dashboard.checkout.checkout_payment.title')}</h2>
        <Separator className="opacity-20 my-6"></Separator>
        <div className="flex flex-row items-center justify-between">
          <p className="text-sm">{t('general.total')}</p>
          <p className="text-lg font-bold">{t('employer_castings.dashboard.checkout.checkout_summary.beta_total')}</p>
        </div>
      </article>
      <article className="flex flex-col gap-6">
        <Button variant="primary" disabled={!publishAllowed || isStatusPending} onClick={handlePublishCasting}>
          {t('general.pay_and_publish')}
        </Button>
        <p className="text-sm text-[var(--color-secondary-gray)]">
          {t('employer_castings.dashboard.checkout.checkout_payment.disclaimer')}
        </p>
      </article>
    </SectionCard>
  );
};

export default CastingCheckoutPaymentForm;
