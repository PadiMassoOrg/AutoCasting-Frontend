import { Button, Label } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../../context/ModalContext';
import { DashboardSection } from '../../../../../layouts/components';
import { Icon } from '../../../../../shared/components/Icon/Icon';
import { SectionTitle } from '../../../../../shared/components/Section';
import ServerError from '../../../../../shared/components/ServerError/ServerError';
import { useSyncCastingSectionStatus } from '../../context/useSyncCastingSectionStatus';
import { useCastingRoleCreateAutosave } from '../../hooks/autosaves';
import { useSectionRoles } from '../../hooks/useSectionRoles';
import EmployerCastingRoleCard from '../EmployerCastingRoleCard';
import CastingRoleModal from '../Form/Role/CastingRoleModal';

const EmployerCastingRolesEditSection = ({ sectionId }: { sectionId: string }) => {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModal();

  const { data, isLoading, error } = useSectionRoles(sectionId);
  const createRoleMutation = useCastingRoleCreateAutosave(sectionId);

  useSyncCastingSectionStatus('roles', data?.sectionStatus);

  if (isLoading || !data) return null;
  if (error) return <ServerError />;

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
      {(data.roles?.length ?? 0) > 0 ? (
        data.roles?.map((role) => <EmployerCastingRoleCard data={role} key={role.id} />)
      ) : (
        <Label className="w-full text-center text-[var(--color-secondary-grey-fonts)] pt-10">
          {t('employer_castings.page.empty_roles')}
        </Label>
      )}
    </DashboardSection>
  );
};

export default EmployerCastingRolesEditSection;
