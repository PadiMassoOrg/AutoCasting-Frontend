import { Button, Separator } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../context/ModalContext';
import { USER_MODE_TALENT, useUserMode } from '../../../../context/UserModeContext';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { getAuthToken } from '../../../../shared/lib/cookies';
import type { CastingRequirement } from '../../types/publicCasting.types';
import type { CastingApplicationRequest } from '../../types/requests';
import CastingApplicationRequirementsModal from '../Form/CastingApplicationRequirementsModal';

type Props = {
  employer: string;
  requirements: CastingRequirement[];
};

const ApplySection = ({ employer, requirements }: Props) => {
  const { t } = useTranslation();
  const isAuth = getAuthToken();
  const { mode } = useUserMode();
  const { openModal, closeModal } = useModal();

  const showApplySection = isAuth && mode === USER_MODE_TALENT;
  const hasRequirements = (requirements ?? []).length > 0;

  const callBackendDirect = () => {
    console.log('backend called');
  };

  const callBackendWithBody = (body: CastingApplicationRequest) => {
    console.log('backend called + body', body);
  };

  const onClickApply = () => {
    if (!showApplySection) return;

    if (!hasRequirements) {
      callBackendDirect();
      return;
    }

    openModal(
      <CastingApplicationRequirementsModal
        requirements={requirements}
        onCancel={closeModal}
        onApply={(body) => {
          callBackendWithBody(body);
          closeModal();
        }}
      />,
      t('application.modal.title'),
      'lg'
    );
  };

  return (
    <article className="w-full rounded-xl border border-[var(--color-secondary-outline)] bg-white py-4 px-5 flex flex-col gap-5">
      <h2 className="text-lg font-semibold">{t('application.cta_title')}</h2>

      {showApplySection ? (
        <p className="text-sm text-[var(--color-secondary-gray)]">
          {t('application.cta_text')}
          <span className="font-semibold"> {employer}</span>
        </p>
      ) : (
        <span className="flex gap-2 items-start">
          <Icon name="info" variant="primary" className="mt-1" />
          <p className="text-sm text-[var(--color-secondary-gray)]">{t('application.cta_auth_warning')}</p>
        </span>
      )}

      <Separator className="opacity-20 my-2" />
      <Button variant="primary" disabled={!showApplySection} onClick={onClickApply}>
        {t('general.apply')}
      </Button>
    </article>
  );
};

export default ApplySection;
