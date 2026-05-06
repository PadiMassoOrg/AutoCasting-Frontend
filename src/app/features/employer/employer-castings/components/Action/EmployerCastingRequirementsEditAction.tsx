import { Button, Icon, type RadioOption } from 'autocasting-ui-library-padimasso';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../../context/ModalContext';
import { useEmployerCastingIds } from '../../context/EmployerCastingContext';
import { useCastingRequirementCreateAutosave } from '../../hooks/autosaves';
import { useSectionRequirements } from '../../hooks/section/useSectionRequirements';
import { useSectionRoles } from '../../hooks/section/useSectionRoles';
import type { CastingRequirementFormKey } from '../../schemas/formSchema';
import type { CastingRequirementUpsertRequest } from '../../types/requests';
import CastingRequirementModal from '../Form/Requirement/CastingRequirementModal';

const EMPTY_ARR: any[] = [];

type EmployerCastingRequirementsEditActionProps = {
  sectionId: string;
};

const EmployerCastingRequirementsEditAction = ({ sectionId }: EmployerCastingRequirementsEditActionProps) => {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModal();
  const { rolesSectionId } = useEmployerCastingIds();
  const { data: rolesSection } = useSectionRoles(rolesSectionId);
  const createRequirementMutation = useCastingRequirementCreateAutosave(sectionId);

  const roles = rolesSection?.roles ?? EMPTY_ARR;
  const requirementsSection = useSectionRequirements(sectionId).data;
  const requirements = requirementsSection?.requirements ?? EMPTY_ARR;

  const roleOptions: RadioOption[] = useMemo(
    () =>
      roles.map((r: any) => ({
        value: r.id,
        label: r.roleName ?? t('general.placeholder.role_name'),
      })),
    [roles, t]
  );

  const disabledRoleIds = useMemo(() => {
    const ids = new Set<string>();
    requirements.forEach((req: any) => {
      if (req?.roleId) ids.add(req.roleId);
    });
    return Array.from(ids);
  }, [requirements]);

  const handleOpenModal = () => {
    if (roleOptions.length === 0) return;
    openModal(
      <CastingRequirementModal
        mode="create"
        sectionId={sectionId}
        roleOptions={roleOptions}
        disabledRoleIds={disabledRoleIds}
        backendErrors={createRequirementMutation.fieldErrors as Partial<Record<CastingRequirementFormKey, string>>}
        clearBackendFieldError={createRequirementMutation.clearFieldError as (field: CastingRequirementFormKey) => void}
        onSave={async (draft) => {
          if (draft.mode !== 'create') return;

          const payload: CastingRequirementUpsertRequest = {
            requirementsSectionId: draft.requirementsSectionId,
            roleIds: draft.roleIds,
            requiresAudio: draft.requiresAudio,
            requiresVideo: draft.requiresVideo,
            description: draft.description?.trim() ? draft.description.trim() : undefined,
          };

          const result = await createRequirementMutation.submit(payload).catch(() => null);
          if (!result) return;
          closeModal();
        }}
        onCancel={closeModal}
      />,
      t('employer_castings.dashboard.requirements.add_new'),
      'lg'
    );
  };

  return (
    <Button variant="primary" disabled={roleOptions.length === 0} onClick={handleOpenModal}>
      <span className="flex flex-row items-center gap-2">
        <Icon name="plus" variant="white" size={16}></Icon>
        {t('general.add')}
      </span>
    </Button>
  );
};

export default EmployerCastingRequirementsEditAction;
