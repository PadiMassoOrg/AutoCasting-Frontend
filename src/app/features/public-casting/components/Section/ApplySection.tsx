import { Button, Separator } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../../../context/ModalContext';
import { USER_MODE_TALENT, useUserMode } from '../../../../context/UserModeContext';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { getAuthToken } from '../../../../shared/lib/cookies';
import { ROUTES } from '../../../../shared/lib/routes';
import { useCastingApplicationMutation } from '../../hooks/useCastingApplicationMutation';
import type { CastingRequirement } from '../../types/publicCasting.types';
import type { CastingApplicationRequest } from '../../types/requests';
import CastingApplicationConfirmationModal from '../Form/CastingApplicationConfirmationModal';
import CastingApplicationRequirementsModal from '../Form/CastingApplicationRequirementsModal';

type Props = {
  employer: string;
  requirements: CastingRequirement[];
  roleId: string;
};

const ApplySection = ({ employer, requirements, roleId }: Props) => {
  const { t } = useTranslation();
  const isAuth = getAuthToken();
  const { mode } = useUserMode();
  const navigate = useNavigate();
  const { openModal, closeModal } = useModal();
  const apply = useCastingApplicationMutation();

  const showApplySection = isAuth && mode === USER_MODE_TALENT;
  const hasRequirements = (requirements ?? []).length > 0;
  const handleConfirmation = () => {
    closeModal();
    navigate(ROUTES.CASTING_DATABASE);
  };

  const callBackendDirect = () => {
    apply.mutate(
      { roleId },
      {
        onSuccess: () => {
          openModal(
            <CastingApplicationConfirmationModal onConfirm={handleConfirmation} />,
            t('application.confirmation_modal.title'),
            'lg'
          );
        },
      }
    );
  };

  const callBackendWithBody = (body: CastingApplicationRequest) => {
    apply.mutate(
      { roleId, request: body },
      {
        onSuccess: () => {
          openModal(
            <CastingApplicationConfirmationModal onConfirm={handleConfirmation} />,
            t('application.confirmation_modal.title'),
            'lg'
          );
        },
      }
    );
  };

  const onClickApply = () => {
    if (!showApplySection) return;

    if (!hasRequirements) {
      callBackendDirect();
      return;
    }

    openModal(
      <CastingApplicationRequirementsModal
        requirements={requirements}
        onCancel={closeModal}
        onApply={(body) => {
          callBackendWithBody(body);
          closeModal();
        }}
      />,
      t('application.modal.title'),
      'lg'
    );
  };

  return (
    <article className="w-full rounded-xl border border-[var(--color-secondary-outline)] bg-white py-4 px-5 flex flex-col gap-5">
      <h2 className="text-lg font-semibold">{t('application.cta_title')}</h2>

      {showApplySection ? (
        <p className="text-sm text-[var(--color-secondary-gray)]">
          {t('application.cta_text')}
          <span className="font-semibold"> {employer}</span>
        </p>
      ) : (
        <span className="flex gap-2 items-start">
          <Icon name="info" variant="primary" className="mt-1" />
          <p className="text-sm text-[var(--color-secondary-gray)]">{t('application.cta_auth_warning')}</p>
        </span>
      )}

      <Separator className="opacity-20" />

      <Button variant="primary" disabled={!showApplySection || apply.isPending} onClick={onClickApply}>
        {apply.isPending ? t('general.loading') : t('general.apply')}
      </Button>
    </article>
  );
};

export default ApplySection;
