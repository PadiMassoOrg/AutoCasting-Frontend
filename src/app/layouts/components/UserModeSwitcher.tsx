import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserMode } from '../../context/UserModeContext';
import { Icon } from '../../shared/components/Icon/Icon';

type ModeSwitcherProps = {
  showLabel?: boolean;
  onAfterToggle?: () => void;
};

function UserModeSwitcher({ showLabel = false, onAfterToggle }: ModeSwitcherProps) {
  const { t } = useTranslation();
  const { mode, toggleMode } = useUserMode();
  const [hovered, setHovered] = useState(false);

  const modeLabel = mode === 'talent' ? t('state.switch_to_employer') : t('state.switch_to_talent');

  const handleClick = () => {
    toggleMode();
    onAfterToggle?.();
  };

  return (
    <span
      className={
        `flex flex-row items-center gap-2 cursor-pointer transition-colors ` +
        (hovered ? 'text-[var(--color-primary-purple)]' : 'text-[var(--color-primary-black)]')
      }
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Icon name="switcher" variant={`${hovered ? 'primary' : 'default'}`} />
      {showLabel && modeLabel}
    </span>
  );
}

export default UserModeSwitcher;
