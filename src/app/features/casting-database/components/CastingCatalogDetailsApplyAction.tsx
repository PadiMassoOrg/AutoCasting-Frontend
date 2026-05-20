import { Button } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../../context/ModalContext';
import { USER_MODE_EMPLOYER, USER_MODE_TALENT, useUserMode } from '../../../context/UserModeContext';
import { getAuthToken } from '../../../shared/lib/cookies';
import { getDashboardRouteForActiveMode, ROUTES } from '../../../shared/lib/routes';
import { useMeData } from '../../auth/hooks/useMeData';
import type { ActiveMode } from '../../auth/types/auth.types';
import CastingApplicationTalentModeModal from '../../public-casting/components/Form/CastingApplicationTalentModeModal';
import CastingApplicationAuthWarningModal from '../../public-casting/components/Form/CastingApplicationAuthWarningModal';
import CastingApplicationConfirmationModal from '../../public-casting/components/Form/CastingApplicationConfirmationModal';
import CastingApplicationRequirementsModal from '../../public-casting/components/Form/CastingApplicationRequirementsModal';
import { useUpdateOnboardingMutation } from '../../onboarding/hooks/useUpdateOnboardingMutation';
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
  const { data: meData } = useMeData();
  const { mode, setMode } = useUserMode();
  const navigate = useNavigate();
  const { openModal, closeModal } = useModal();
  const apply = useCastingApplicationMutation();
  const { mutate: updateOnboarding, isPending: isSwitchingMode } = useUpdateOnboardingMutation();
  const isAlreadyApplied = Boolean(data.alreadyApplied);
  const isLoggedIn = Boolean(isAuth);
  const isTalentMode = mode === USER_MODE_TALENT;
  const isEmployerMode = mode === USER_MODE_EMPLOYER;
  const canApply = isLoggedIn && isTalentMode;
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

  const handleSwitchToTalent = () => {
    if (!meData || isSwitchingMode) return;

    const nextMode = USER_MODE_TALENT;
    const nextActiveMode: ActiveMode = 'TALENT';
    const nextDashboardRoute = getDashboardRouteForActiveMode(nextActiveMode);
    const talentOnboardingStatus =
      meData.talentOnboardingStatus === 'NOT_STARTED' ? 'IN_PROGRESS' : meData.talentOnboardingStatus;

    updateOnboarding(
      {
        activeMode: nextActiveMode,
        talentOnboardingStatus,
        employerOnboardingStatus: meData.employerOnboardingStatus,
      },
      {
        onSuccess: () => {
          setMode(nextMode);
          closeModal();
          navigate(nextDashboardRoute);
        },
      }
    );
  };

  const openTalentModeModal = () => {
    openModal(
      <CastingApplicationTalentModeModal
        onCancel={closeModal}
        onSwitchToTalent={handleSwitchToTalent}
        loading={isSwitchingMode}
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
    if (!isLoggedIn) {
      openAuthWarningModal();
      return;
    }
    if (isEmployerMode) {
      openTalentModeModal();
      return;
    }
    if (!canApply) return;
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
