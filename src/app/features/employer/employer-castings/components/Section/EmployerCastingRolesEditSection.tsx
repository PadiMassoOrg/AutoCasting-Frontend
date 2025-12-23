import { Button } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../../context/ModalContext';
import { DashboardSection } from '../../../../../layouts/components';
import { Icon } from '../../../../../shared/components/Icon/Icon';
import { SectionTitle } from '../../../../../shared/components/Section';
import CastingRoleModal from '../Form/Role/CastingRoleModal';

const EmployerCastingRolesEditSection = () => {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModal();

  // TODO: Handle EDIT or NEW
  const handleOpenModal = () => {
    openModal(
      <CastingRoleModal
        onSave={() => {
          console.log('save Role Modal');
        }}
        onCancel={closeModal}
      />,
      t('employer_castings.dashboard.roles.add_new'),
      'lg'
    );
  };

  const actionButtonRender = () => (
    <Button onClick={handleOpenModal} className="flex flex-row items-center justify-center gap-2">
      <Icon name="plus" variant="white" size={16} />
      <span className="text-base font-medium">{t('employer_castings.dashboard.roles.add_new')}</span>
    </Button>
  );

  return (
    <DashboardSection>
      <SectionTitle title={t('employer_castings.dashboard.roles.roles')} action={actionButtonRender()} />
    </DashboardSection>
  );
};

export default EmployerCastingRolesEditSection;
