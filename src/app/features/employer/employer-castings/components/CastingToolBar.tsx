import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ButtonRow from '../../../../shared/components/ButtonRow/ButtonRow';
import { Icon } from '../../../../shared/components/Icon/Icon';
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

  console.log(publishAllowed);

  return (
    <section className="w-full flex items-center justify-center mb-4">
      <ButtonRow
        items={[
          <div className="flex flex-row gap-2 items-center cursor-pointer" onClick={redirectToCastingsList}>
            <Icon variant="default" name="save" />
            <p className="text-sm font-semibold">{t('general.save_changes')}</p>
          </div>,
          <div
            onClick={handlePublishCasting}
            className={`flex flex-row gap-2 items-center ${publishAllowed ? 'cursor-pointer' : 'cursor-not-allowed'}`}
          >
            <Icon variant={publishAllowed ? 'primary' : 'disabled'} name="publish" />
            <p
              className={`text-sm font-semibold ${publishAllowed ? 'text-[var(--color-primary-purple)]' : 'text-[var(--color-secondary-disabled-grey)]'}`}
            >
              {t('general.publish_casting')}
            </p>
          </div>,
          <div className="flex flex-row gap-2 items-center cursor-pointer" onClick={handleDeleteCasting}>
            <Icon variant="danger" name="delete" />
            <p className="text-sm font-semibold text-[var(--color-alert-error)]">{t('general.delete')}</p>
          </div>,
        ]}
      ></ButtonRow>
    </section>
  );
};

export default CastingToolBar;
