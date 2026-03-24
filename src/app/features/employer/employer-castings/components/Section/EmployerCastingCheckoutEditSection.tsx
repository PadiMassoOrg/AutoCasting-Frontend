import { Button } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { DashboardSection } from '../../../../../layouts/components';
import { SectionTitle } from '../../../../../shared/components/Section';
import { ROUTES } from '../../../../../shared/lib/routes';
import { CASTING_STATUS_PUBLISHED } from '../../../../sitemetadata/utils/siteMetadataUtils';
import { useEmployerCastingIds, useEmployerCastingPublishAllowed } from '../../context/EmployerCastingContext';
import { useCastingStatusActions } from '../../hooks/status/useCastingStatusActions';

const EmployerCastingCheckoutEditSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id: castingId, defaultCode } = useEmployerCastingIds() as any;
  const { setStatusByCode, isPending: isStatusPending } = useCastingStatusActions();
  const publishAllowed = useEmployerCastingPublishAllowed();

  const handlePublishCasting = async () => {
    if (!publishAllowed || isStatusPending) return;
    await setStatusByCode(CASTING_STATUS_PUBLISHED, { id: castingId, slug: defaultCode });
    navigate(ROUTES.EMPLOYER_CASTINGS);
  };

  return (
    <DashboardSection>
      <SectionTitle title={t('employer_castings.dashboard.checkout.checkout_and_publish')} />
      <div className="items-center">
        <Button variant="primary" disabled={!publishAllowed || isStatusPending} onClick={handlePublishCasting}>
          {t('general.publish')}
        </Button>{' '}
      </div>
    </DashboardSection>
  );
};

export default EmployerCastingCheckoutEditSection;
