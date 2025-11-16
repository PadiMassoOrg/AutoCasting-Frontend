import { useTranslation } from 'react-i18next';
import { useUserMode } from '../../context/UserModeContext';
import SwitcherIcon from '../../shared/icons/switcher-purple.svg';

type ModeSwitcherProps = {
  showLabel?: boolean;
  onAfterToggle?: () => void;
};

function UserModeSwitcher({ showLabel = false, onAfterToggle }: ModeSwitcherProps) {
  const { t } = useTranslation();
  const { mode, toggleMode } = useUserMode();

  const modeLabel = mode === 'talent' ? t('state.switch_to_employer') : t('state.switch_to_talent');

  const handleClick = () => {
    toggleMode();
    onAfterToggle?.();
  };

  return (
    <span
      className="flex flex-row items-center gap-2 cursor-pointer text-[var(--color-primary-purple)]"
      onClick={handleClick}
    >
      <img src={SwitcherIcon} alt="" className="w-6" />
      {showLabel && t(modeLabel)}
    </span>
  );
}

export default UserModeSwitcher;
