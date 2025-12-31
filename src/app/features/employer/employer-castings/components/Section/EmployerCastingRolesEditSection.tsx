import { Button, Label } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../../context/ModalContext';
import { DashboardSection } from '../../../../../layouts/components';
import { Icon } from '../../../../../shared/components/Icon/Icon';
import { SectionTitle } from '../../../../../shared/components/Section';
import { useCastingRoleAutosave } from '../../hooks/autosaves';
import { useCastingRoles } from '../../hooks/useCastingRoles';
import EmployerCastingRoleCard from '../EmployerCastingRoleCard';
import CastingRoleModal from '../Form/Role/CastingRoleModal';

const EmployerCastingRolesEditSection = ({ sectionId }: { sectionId: string }) => {
  const { t } = useTranslation();
  const { data } = useCastingRoles(sectionId);
  const createRoleMutation = useCastingRoleAutosave(sectionId);

  const { openModal, closeModal } = useModal();

  const handleOpenModal = () => {
    openModal(
      <CastingRoleModal
        mode="create"
        onSave={(draft) => {
          createRoleMutation.immediate(draft);
          closeModal();
        }}
        onCancel={closeModal}
        sectionId={sectionId}
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
      {data?.length! > 0 ? (
        data?.map((role) => <EmployerCastingRoleCard data={role} key={role.id}></EmployerCastingRoleCard>)
      ) : (
        <Label className="w-full text-center text-[var(--color-secondary-grey-fonts)] pt-10">
          {t('employer_castings.page.empty_roles')}
        </Label>
      )}
    </DashboardSection>
  );
};

export default EmployerCastingRolesEditSection;
