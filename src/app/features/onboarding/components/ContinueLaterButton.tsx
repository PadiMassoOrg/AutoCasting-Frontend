import { t } from 'i18next';
import { Icon } from '../../../shared/components/Icon/Icon';
import { logout } from '../../auth/services/authService';

const ContinueLaterButton = () => {
  return (
    <button
      onClick={logout}
      className="w-full cursor-pointer text-sm flex flex-row items-center justify-center gap-4 text-[var(--color-primary-purple)]"
    >
      <Icon name="arrowLongLeft" variant="primary" size={18} />
      <span>{t('onboarding.mode_selector.go_back')}</span>
    </button>
  );
};

export default ContinueLaterButton;
