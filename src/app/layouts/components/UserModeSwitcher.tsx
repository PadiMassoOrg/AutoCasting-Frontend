import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserMode } from '../../context/UserModeContext';
import { useMeData } from '../../features/auth/hooks/useMeData';
import type { ActiveMode } from '../../features/auth/types/auth.types';
import { useUpdateOnboardingMutation } from '../../features/onboarding/hooks/useUpdateOnboardingMutation';
import { Icon } from '../../shared/components/Icon/Icon';

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

  const modeLabel = mode === 'talent' ? t('state.switch_to_employer') : t('state.switch_to_talent');

  const handleClick = () => {
    if (!meData || isPending) return;

    const nextMode = mode === 'talent' ? 'employer' : 'talent';
    const nextActiveMode: ActiveMode = nextMode === 'talent' ? 'TALENT' : 'EMPLOYER';

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
