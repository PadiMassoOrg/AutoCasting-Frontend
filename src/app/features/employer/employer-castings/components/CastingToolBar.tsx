import { Button } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../shared/lib/routes';
import { useEmployerCastingIds, useEmployerCastingPublishAllowed } from '../context/EmployerCastingContext';
import { usePublishCastingMutation } from '../hooks/status/usePublishCastingMutation';
import { useDeleteCastingMutation } from '../hooks/useDeleteCastingMutation';

const CastingToolBar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutate: deleteCasting } = useDeleteCastingMutation();
  const { mutate: publish, isPending: isPublishing } = usePublishCastingMutation();
  const { id: castingId, defaultCode } = useEmployerCastingIds();
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

  return (
    <section className="w-full flex items-center justify-end gap-4 mb-2">
      <p
        className="cursor-pointer underline text-sm font-light text-[var(--color-alert-error)]"
        onClick={handleDeleteCasting}
      >
        {t('general.delete')}
      </p>
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
      {/* TODO: Actions */}
      {/* <span>ACC</span> */}
    </section>
  );
};

export default CastingToolBar;
