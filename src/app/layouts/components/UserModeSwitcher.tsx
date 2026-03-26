import { Icon } from 'autocasting-ui-library-padimasso';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { USER_MODE_EMPLOYER, USER_MODE_TALENT, useUserMode } from '../../context/UserModeContext';
import { useMeData } from '../../features/auth/hooks/useMeData';
import type { ActiveMode } from '../../features/auth/types/auth.types';
import { useUpdateOnboardingMutation } from '../../features/onboarding/hooks/useUpdateOnboardingMutation';
import { getAuthToken } from '../../shared/lib/cookies';
import { ROUTES } from '../../shared/lib/routes';
import { jwtDecoder } from '../../shared/utils/jwtDecoder';

type ModeSwitcherProps = {
  showLabel?: boolean;
  onAfterToggle?: () => void;
};

function UserModeSwitcher({ showLabel = false, onAfterToggle }: ModeSwitcherProps) {
  const { t } = useTranslation();
  const { data: meData } = useMeData();
  const { mode, setMode } = useUserMode();
  const [hovered, setHovered] = useState(false);
  const { mutate: updateOnboarding, isPending } = useUpdateOnboardingMutation();
  const navigate = useNavigate();

  const token = getAuthToken();
  const decoded = token ? jwtDecoder(token) : null;
  const talentProfileSlug = decoded?.talentProfileSlug;

  const modeLabel = mode === USER_MODE_TALENT ? t('state.switch_to_employer') : t('state.switch_to_talent');

  const handleClick = () => {
    if (!meData || isPending) return;

    const nextMode = mode === USER_MODE_TALENT ? USER_MODE_EMPLOYER : USER_MODE_TALENT;
    const nextActiveMode: ActiveMode = nextMode === USER_MODE_TALENT ? 'TALENT' : 'EMPLOYER';

    let talentOnboardingStatus = meData.talentOnboardingStatus;
    let employerOnboardingStatus = meData.employerOnboardingStatus;

    if (nextActiveMode === 'TALENT' && talentOnboardingStatus === 'NOT_STARTED') {
      talentOnboardingStatus = 'IN_PROGRESS';
    }

    if (nextActiveMode === 'EMPLOYER' && employerOnboardingStatus === 'NOT_STARTED') {
      employerOnboardingStatus = 'IN_PROGRESS';
    }

    updateOnboarding(
      {
        activeMode: nextActiveMode,
        talentOnboardingStatus,
        employerOnboardingStatus,
      },
      {
        onSuccess: () => {
          setMode(nextMode);

          if (nextActiveMode === 'TALENT') {
            if (talentProfileSlug) {
              navigate(`${ROUTES.PUBLIC_PROFILE}/${talentProfileSlug}`);
            } else {
              navigate(ROUTES.TALENT);
            }
          } else {
            navigate(ROUTES.DASHBOARD);
          }

          onAfterToggle?.();
        },
      }
    );
  };

  return (
    <span
      className={
        'flex flex-row items-center gap-2 cursor-pointer transition-colors ' +
        (hovered ? 'text-[var(--color-primary-purple)]' : 'text-[var(--color-primary-black)]')
      }
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Icon name="switcher" variant={hovered ? 'primary' : 'default'} />
      {showLabel && modeLabel}
    </span>
  );
}

export default UserModeSwitcher;
