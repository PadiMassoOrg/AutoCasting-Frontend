import { Button, Separator } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useModal } from '../../../../context/ModalContext';
import { USER_MODE_TALENT, useUserMode } from '../../../../context/UserModeContext';
import { Icon } from 'autocasting-ui-library-padimasso';
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
  alreadyApplied?: boolean;
  multipleAlreadyApplied?: boolean;
  shouldShowApplyAction?: boolean;
};

const ApplySection = ({
  employer,
  requirements,
  roleId,
  alreadyApplied,
  multipleAlreadyApplied = false,
  shouldShowApplyAction = true,
}: Props) => {
  const { t } = useTranslation();
  const isAuth = getAuthToken();
  const { mode } = useUserMode();
  const navigate = useNavigate();
  const { openModal, closeModal } = useModal();
  const apply = useCastingApplicationMutation();
  const { slug } = useParams<{ slug: string }>();

  const showApplySection = isAuth && mode === USER_MODE_TALENT;
  const hasRequirements = (requirements ?? []).length > 0;

  const isAlreadyApplied = Boolean(alreadyApplied);
  const isDisabled = !showApplySection || apply.isPending || isAlreadyApplied;

  const handleConfirmation = () => {
    closeModal();
    navigate(ROUTES.CASTING_DATABASE);
  };

  const callBackendDirect = () => {
    apply.mutate(
      { roleId, slug: slug! },
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
      { roleId, slug: slug!, request: body },
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
    if (!shouldShowApplyAction) return;
    if (!showApplySection) return;
    if (isAlreadyApplied) return;
    if (apply.isPending) return;
    if (!slug) return;

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

  const renderInfoBlock = () => {
    if (!showApplySection) {
      return (
        <span className="flex gap-2 items-start">
          <Icon name="info" variant="primary" className="mt-1" />
          <p className="text-sm text-[var(--color-secondary-gray)]">{t('application.cta_auth_warning')}</p>
        </span>
      );
    }

    if (multipleAlreadyApplied) {
      return (
        <span className="flex gap-2 items-start">
          <Icon name="info" variant="primary" className="mt-1" />
          <p className="text-sm text-[var(--color-secondary-gray)]">{t('application.cta_multiple_applied_warning')}</p>
        </span>
      );
    }

    if (isAlreadyApplied) {
      return (
        <span className="flex gap-2 items-start">
          <Icon name="info" variant="primary" className="mt-1" />
          <p className="text-sm text-[var(--color-secondary-gray)]">{t('application.cta_applied_warning')}</p>
        </span>
      );
    }

    return (
      <p className="text-sm text-[var(--color-secondary-gray)]">
        {t('application.cta_text')}
        <span className="font-semibold"> {employer}</span>
      </p>
    );
  };

  return (
    <article className="w-full rounded-xl border border-[var(--color-secondary-outline)] bg-white py-4 px-5 flex flex-col gap-5">
      <h2 className="text-lg font-semibold">{t('application.cta_title')}</h2>

      {renderInfoBlock()}

      {shouldShowApplyAction && (
        <>
          <Separator className="opacity-20" />
          <Button variant="primary" disabled={isDisabled} onClick={onClickApply}>
            {t('general.apply')}
          </Button>
        </>
      )}
    </article>
  );
};

export default ApplySection;
