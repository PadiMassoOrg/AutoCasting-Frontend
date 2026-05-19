import { Button } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../../context/ModalContext';
import { USER_MODE_TALENT, useUserMode } from '../../../context/UserModeContext';
import { getAuthToken } from '../../../shared/lib/cookies';
import { ROUTES } from '../../../shared/lib/routes';
import CastingApplicationAuthWarningModal from '../../public-casting/components/Form/CastingApplicationAuthWarningModal';
import CastingApplicationConfirmationModal from '../../public-casting/components/Form/CastingApplicationConfirmationModal';
import CastingApplicationRequirementsModal from '../../public-casting/components/Form/CastingApplicationRequirementsModal';
import { useCastingApplicationMutation } from '../../public-casting/hooks/useCastingApplicationMutation';
import type { CastingApplicationRequest } from '../../public-casting/types/requests';
import type {
  CastingCatalogDetailsResponse,
  CastingCatalogRole,
  CastingRequirement,
} from '../types/casting-database.types';

type Props = {
  data: CastingCatalogDetailsResponse;
};

export default function CastingCatalogDetailsApplyAction({ data }: Props) {
  const { t } = useTranslation();
  const isAuth = getAuthToken();
  const { mode } = useUserMode();
  const navigate = useNavigate();
  const { openModal, closeModal } = useModal();
  const apply = useCastingApplicationMutation();
  const canApply = Boolean(isAuth) && mode === USER_MODE_TALENT;
  const isAlreadyApplied = Boolean(data.alreadyApplied);
  const role = data.casting.roles[0] ?? null;
  const requirements = toRequirements(role);

  const handleConfirmation = () => {
    closeModal();
    navigate(ROUTES.CASTING_DATABASE);
  };

  const openConfirmationModal = () => {
    openModal(
      <CastingApplicationConfirmationModal onConfirm={handleConfirmation} />,
      t('application.confirmation_modal.title'),
      'lg'
    );
  };

  const openAuthWarningModal = () => {
    openModal(
      <CastingApplicationAuthWarningModal
        onLogin={() => {
          closeModal();
          navigate(ROUTES.AUTH);
        }}
        onRegister={() => {
          closeModal();
          navigate(ROUTES.AUTH_REGISTER);
        }}
      />,
      t('application.cta_title'),
      'lg'
    );
  };

  const callBackendDirect = () => {
    if (!role?.id) return;

    apply.mutate(
      { roleId: role.id, slug: data.casting.slug },
      {
        onSuccess: () => {
          openConfirmationModal();
        },
      }
    );
  };

  const callBackendWithBody = (body: CastingApplicationRequest) => {
    if (!role?.id) return;

    apply.mutate(
      { roleId: role.id, slug: data.casting.slug, request: body },
      {
        onSuccess: () => {
          closeModal();
          openConfirmationModal();
        },
      }
    );
  };

  const onClickApply = () => {
    if (isAlreadyApplied || apply.isPending) return;
    if (!canApply) {
      openAuthWarningModal();
      return;
    }
    if (!role?.id) return;

    if (requirements.length === 0) {
      callBackendDirect();
      return;
    }

    openModal(
      <CastingApplicationRequirementsModal
        requirements={requirements}
        onCancel={closeModal}
        onApply={callBackendWithBody}
      />,
      t('application.modal.title'),
      'lg'
    );
  };

  return (
    <Button
      variant="primary"
      className="w-fit max-w-[350px]"
      disabled={isAlreadyApplied}
      loading={apply.isPending}
      onClick={onClickApply}
    >
      {!isAlreadyApplied ? t('general.apply') : t('applications.already_applied_cta')}
    </Button>
  );
}

function toRequirements(role: CastingCatalogRole | null): CastingRequirement[] {
  if (!role?.id) return [];
  if (!role.requiresAudio && !role.requiresVideo) return [];

  return [
    {
      id: role.id,
      roleId: role.id,
      description: role.requirementDescription ?? '',
      requiresAudio: role.requiresAudio,
      requiresVideo: role.requiresVideo,
    },
  ];
}
