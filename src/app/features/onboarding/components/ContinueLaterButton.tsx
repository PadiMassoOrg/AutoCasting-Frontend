import { Icon } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { USER_MODE_EMPLOYER, USER_MODE_TALENT, useUserMode } from '../../../context/UserModeContext';
import { ROUTES } from '../../../shared/lib/routes';
import { useMeData } from '../../auth/hooks/useMeData';
import { logout } from '../../auth/services/authService';
import { useUpdateOnboardingMutation } from '../hooks/useUpdateOnboardingMutation';

function ContinueLaterButton() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: meData } = useMeData();
  const { mutate: updateOnboarding } = useUpdateOnboardingMutation();
  const { setMode } = useUserMode();

  const handleClick = () => {
    if (!meData) {
      logout();
      return;
    }

    const hasTalentCompleted = meData.talentOnboardingStatus === 'COMPLETED';
    const hasEmployerCompleted = meData.employerOnboardingStatus === 'COMPLETED';

    if (!hasTalentCompleted && !hasEmployerCompleted) {
      logout();
      return;
    }

    let nextActiveMode = meData.activeMode;

    if (hasTalentCompleted) {
      nextActiveMode = 'TALENT';
    } else if (hasEmployerCompleted) {
      nextActiveMode = 'EMPLOYER';
    }

    updateOnboarding(
      {
        activeMode: nextActiveMode,
        talentOnboardingStatus: meData.talentOnboardingStatus,
        employerOnboardingStatus: meData.employerOnboardingStatus,
      },
      {
        onSuccess: () => {
          if (nextActiveMode === 'TALENT') {
            setMode(USER_MODE_TALENT);
          } else if (nextActiveMode === 'EMPLOYER') {
            setMode(USER_MODE_EMPLOYER);
          }
          navigate(ROUTES.DASHBOARD);
        },
      }
    );
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full cursor-pointer text-sm flex flex-row items-center justify-center gap-4 text-[var(--color-primary-purple)]"
    >
      <Icon name="arrowLongLeft" variant="primary" />
      <span>{t('onboarding.mode_selector.go_back')}</span>
    </button>
  );
}

export default ContinueLaterButton;
