import { t } from 'i18next';
import ArrowLeftIconPurple from '../../../shared/icons/arrow-long-left-purple.svg';
import { logout } from '../../auth/services/authService';

const ContinueLaterButton = () => {
  return (
    <button
      onClick={logout}
      className="w-full cursor-pointer text-sm flex flex-row items-center justify-center gap-2 text-[var(--color-primary-purple)]"
    >
      <img src={ArrowLeftIconPurple} className="w-4" />
      <span>{t('onboarding.mode_selector.go_back')}</span>
    </button>
  );
};

export default ContinueLaterButton;
