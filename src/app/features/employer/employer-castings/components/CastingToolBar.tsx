import { Button } from 'autocasting-ui-library-padimasso';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import OverflowMenu from '../../../../shared/components/OverflowMenu/OverflowMenu';
import type { OverflowMenuItem } from '../../../../shared/components/OverflowMenu/overflowmenu.types';
import { ROUTES } from '../../../../shared/lib/routes';
import { copyToClipboardGraceful } from '../../../../shared/utils/domUtils';
import { isCastingStatusPublished } from '../../../../shared/utils/siteMetadatUtils';
import { useEmployerCastingIds, useEmployerCastingPublishAllowed } from '../context/EmployerCastingContext';
import { usePublishCastingMutation } from '../hooks/status/usePublishCastingMutation';
import { useDeleteCastingMutation } from '../hooks/useDeleteCastingMutation';

const CastingToolBar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { mutate: deleteCasting } = useDeleteCastingMutation();
  const { mutate: publish, isPending: isPublishing } = usePublishCastingMutation();

  const { id: castingId, defaultCode, castingStatus } = useEmployerCastingIds() as any;
  const publishAllowed = useEmployerCastingPublishAllowed();

  const redirectToCastingsList = () => {
    navigate(ROUTES.EMPLOYER_CASTINGS);
  };

  const handlePublishCasting = () => {
    if (!publishAllowed || isPublishing) return;

    publish(
      { id: castingId, slug: defaultCode },
      {
        onSuccess: () => {
          redirectToCastingsList();
        },
      }
    );
  };

  const handleDeleteCasting = () => {
    deleteCasting(
      { id: castingId },
      {
        onSuccess: () => {
          redirectToCastingsList();
        },
      }
    );
  };

  const publicCastingPath = `${ROUTES.PUBLIC_CASTING}/${defaultCode}`;

  const actionsDisabled = !isCastingStatusPublished(castingStatus) || !publishAllowed || isPublishing;

  const items: OverflowMenuItem[] = useMemo(
    () => [
      {
        key: 'details',
        label: t('employer_castings.actions.view_details'),
        disabled: actionsDisabled,
        onSelect: () => navigate(publicCastingPath),
      },
      {
        key: 'applicants',
        label: t('employer_castings.actions.view_applicants'),
        disabled: actionsDisabled,
        onSelect: () => console.log('view_applicants'),
      },
      {
        key: 'copy_link',
        label: t('employer_castings.actions.copy_link'),
        disabled: actionsDisabled,
        onSelect: () => {
          const url = new URL(publicCastingPath, window.location.origin).toString();
          void copyToClipboardGraceful(url);
        },
      },
      { type: 'separator', key: 'sep-1' },
      {
        key: 'delete',
        label: t('general.delete'),
        destructive: true,
        onSelect: () => handleDeleteCasting(),
      },
    ],
    [t, actionsDisabled, navigate, publicCastingPath]
  );

  return (
    <section className="w-full flex items-center justify-end gap-2 mb-2">
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
