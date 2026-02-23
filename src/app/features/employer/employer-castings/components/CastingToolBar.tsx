import { Button } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import OverflowMenu from '../../../../shared/components/OverflowMenu/OverflowMenu';
import { ROUTES } from '../../../../shared/lib/routes';
import { CASTING_STATUS_PUBLISHED, isCastingStatusPublished } from '../../../sitemetadata/utils/siteMetadataUtils';
import { useEmployerCastingIds, useEmployerCastingPublishAllowed } from '../context/EmployerCastingContext';
import { useCastingStatusActions } from '../hooks/status/useCastingStatusActions';
import { useCastingOverflowMenuItems } from '../hooks/useCastingOverflowMenuItems';
import { useDeleteCastingMutation } from '../hooks/useDeleteCastingMutation';

/**
 * CastingToolBar:
 * - Desktop ONLY.
 */
const CastingToolBar = () => {
  const { t, redirectToCastingsList, handlePublishCasting, publishAllowed, isPublishing, items } =
    useEmployerCastingToolbarLogic();

  return (
    <section className="w-full hidden lg:flex items-center justify-end gap-2 mb-2 ">
      <Button
        variant="primaryOutline"
        className="flex flex-row gap-2 items-center cursor-pointer max-w-[185px]"
        onClick={redirectToCastingsList}
      >
        <p className="text-sm font-semibold">{t('general.save_changes')}</p>
      </Button>

      <Button
        variant="primary"
        className="max-w-[185px]"
        disabled={!publishAllowed || isPublishing}
        onClick={handlePublishCasting}
      >
        {t('general.publish_casting')}
      </Button>

      <OverflowMenu items={items} align="end" side="bottom" />
    </section>
  );
};

export default CastingToolBar;

/**
 * CastingBottomBar:
 * - Mobile ONLY - (DashboardShell mobileView === 'nav')
 */
export const CastingBottomBar = () => {
  const { t, redirectToCastingsList, handlePublishCasting, publishAllowed, isPublishing, items } =
    useEmployerCastingToolbarLogic();

  return (
    <section className="w-full lg:hidden flex items-center gap-2">
      <Button variant="primaryOutline" onClick={redirectToCastingsList}>
        <p className="text-sm font-semibold">{t('general.save')}</p>
      </Button>

      <Button variant="primary" disabled={!publishAllowed || isPublishing} onClick={handlePublishCasting}>
        {t('general.publish')}
      </Button>
      <div className="px-1">
        <OverflowMenu items={items} align="end" side="top" />
      </div>
    </section>
  );
};

// Hook
const useEmployerCastingToolbarLogic = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutate: deleteCasting, isPending: isDeleting } = useDeleteCastingMutation();
  const { setStatusByCode, isPending: isStatusPending } = useCastingStatusActions();
  const { id: castingId, defaultCode, castingStatus } = useEmployerCastingIds() as any;
  const publishAllowed = useEmployerCastingPublishAllowed();

  const redirectToCastingsList = () => navigate(ROUTES.EMPLOYER_CASTINGS);

  const handlePublishCasting = async () => {
    if (!publishAllowed || isStatusPending) return;

    await setStatusByCode(CASTING_STATUS_PUBLISHED, { id: castingId, slug: defaultCode });
    redirectToCastingsList();
  };

  const handleDeleteCasting = () => {
    if (isDeleting) return;
    deleteCasting(
      { id: castingId },
      {
        onSuccess: () => redirectToCastingsList(),
      }
    );
  };

  const publicCastingPath = `${ROUTES.PUBLIC_CASTING}/${defaultCode}`;
  const actionsDisabled = !isCastingStatusPublished(castingStatus) || !publishAllowed || isStatusPending;

  const items = useCastingOverflowMenuItems({
    publicCastingPath,
    disablePublicActions: actionsDisabled,
    onDelete: handleDeleteCasting,
    deleteDisabled: isDeleting,
  });

  return {
    t,
    redirectToCastingsList,
    handlePublishCasting,
    publishAllowed,
    isPublishing: isStatusPending,
    items,
  };
};
