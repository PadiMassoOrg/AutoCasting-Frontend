import { Button, Icon } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../../context/ModalContext';
import { useCastingRoleCreateAutosave } from '../../hooks/autosaves';
import type { CastingRoleFormKey } from '../../schemas/formSchema';
import CastingRoleModal from '../Form/Role/CastingRoleModal';

type EmployerCastingRolesEditActionProps = {
  sectionId: string;
};

const EmployerCastingRolesEditAction = ({ sectionId }: EmployerCastingRolesEditActionProps) => {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModal();
  const createRoleMutation = useCastingRoleCreateAutosave(sectionId);

  const handleOpenModal = () => {
    openModal(
      <CastingRoleModal
        mode="create"
        backendErrors={createRoleMutation.fieldErrors as Partial<Record<CastingRoleFormKey, string>>}
        clearBackendFieldError={createRoleMutation.clearFieldError as (field: CastingRoleFormKey) => void}
        onSave={async (draft) => {
          const result = await createRoleMutation.submit(draft).catch(() => null);
          if (!result) return;
          closeModal();
        }}
        onCancel={closeModal}
        sectionId={sectionId}
      />,
      t('employer_castings.dashboard.roles.add_new'),
      'lg'
    );
  };

  return (
    <Button variant="primary" onClick={handleOpenModal}>
      <span className="flex flex-row items-center gap-2">
        <Icon name="plus" variant="white" size={16}></Icon>
        {t('employer_castings.dashboard.roles.add_new')}
      </span>
    </Button>
  );
};

export default EmployerCastingRolesEditAction;
