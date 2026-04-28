import { Icon, Tooltip } from 'autocasting-ui-library-padimasso';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { USER_MODE_EMPLOYER, USER_MODE_TALENT, useUserMode } from '../../context/UserModeContext';
import { useMeData } from '../../features/auth/hooks/useMeData';
import type { ActiveMode } from '../../features/auth/types/auth.types';
import { useUpdateOnboardingMutation } from '../../features/onboarding/hooks/useUpdateOnboardingMutation';
import { getDashboardRouteForActiveMode } from '../../shared/lib/routes';

type ModeSwitcherProps = {
  showTooltip?: boolean;
  showLabel?: boolean;
  onAfterToggle?: () => void;
};

function UserModeSwitcher({ showLabel = false, onAfterToggle, showTooltip = false }: ModeSwitcherProps) {
  const { t } = useTranslation();
  const { data: meData } = useMeData();
  const { mode, setMode } = useUserMode();
  const [hovered, setHovered] = useState(false);
  const { mutate: updateOnboarding, isPending } = useUpdateOnboardingMutation();
  const navigate = useNavigate();

  const modeLabel = mode === USER_MODE_TALENT ? t('state.switch_to_employer') : t('state.switch_to_talent');

  const handleClick = () => {
    if (!meData || isPending) return;

    const nextMode = mode === USER_MODE_TALENT ? USER_MODE_EMPLOYER : USER_MODE_TALENT;
    const nextActiveMode: ActiveMode = nextMode === USER_MODE_TALENT ? 'TALENT' : 'EMPLOYER';
    const nextDashboardRoute = getDashboardRouteForActiveMode(nextActiveMode);

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
          navigate(nextDashboardRoute);
          onAfterToggle?.();
        },
      }
    );
  };

  const content = (
    <span
      className={
        'flex flex-row items-center gap-2 cursor-pointer transition-colors lg:p-2 lg:px-3 ' +
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

  if (showTooltip) {
    return (
      <Tooltip title={modeLabel} position="bottomLeft" nudgeY={-10}>
        {content}
      </Tooltip>
    );
  }

  return content;
}

export default UserModeSwitcher;
