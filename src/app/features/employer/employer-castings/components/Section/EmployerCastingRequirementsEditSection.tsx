import { Button, Label } from 'autocasting-ui-library-padimasso';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../../context/ModalContext';
import { DashboardSection } from '../../../../../layouts/components';
import type { RadioOption } from '../../../../../shared/components/Form/RadioGroupField';
import { Icon } from '../../../../../shared/components/Icon/Icon';
import { SectionTitle } from '../../../../../shared/components/Section';
import { useCastingRequirementCreateAutosave } from '../../hooks/autosaves';
import { useCastingRequirements } from '../../hooks/useCastingRequirements';
import type { EmployerCastingRequirementCardResponse } from '../../types/employerCastings.types';
import type { CastingRequirementUpsertRequest } from '../../types/requests';
import EmployerCastingRequirementCard from '../EmployerCastingRequirementCard';
import CastingRequirementModal from '../Form/Requirement/CastingRequirementModal';

type RoleRef = {
  id: string;
  roleName: string | null;
};

const EmployerCastingRequirementsEditSection = ({ sectionId, roles }: { sectionId: string; roles: RoleRef[] }) => {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModal();
  const requirementsQuery = useCastingRequirements(sectionId);
  const createRequirementMutation = useCastingRequirementCreateAutosave(sectionId);

  const data = (requirementsQuery.data ?? []) as EmployerCastingRequirementCardResponse[];

  const roleOptions: RadioOption[] = useMemo(
    () =>
      (roles ?? []).map((r) => ({
        value: r.id,
        label: r.roleName ?? t('general.placeholder.role_name'),
      })),
    [roles, t]
  );

  const disabledRoleIds = useMemo(() => {
    const ids = new Set<string>();
    (data ?? []).forEach((req) => {
      if (req?.roleId) ids.add(req.roleId);
    });
    return Array.from(ids);
  }, [data]);

  const handleOpenModal = () => {
    openModal(
      <CastingRequirementModal
        mode="create"
        sectionId={sectionId}
        roleOptions={roleOptions}
        disabledRoleIds={disabledRoleIds}
        onSave={(draft) => {
          if (draft.mode !== 'create') return;
          const payload: CastingRequirementUpsertRequest = {
            requirementsSectionId: draft.requirementsSectionId,
            roleIds: draft.roleIds,
            requiresAudio: draft.requiresAudio,
            requiresVideo: draft.requiresVideo,
            description: draft.description?.trim() ? draft.description.trim() : undefined,
          };

          createRequirementMutation.immediate(payload);
          closeModal();
        }}
        onCancel={closeModal}
      />,
      t('employer_castings.dashboard.requirements.add_new'),
      'lg'
    );
  };

  const actionButtonRender = () => (
    <Button onClick={handleOpenModal} className="flex flex-row items-center justify-center gap-2">
      <Icon name="plus" variant="white" size={16} />
      <span className="text-base font-medium">{t('employer_castings.dashboard.requirements.add_new')}</span>
    </Button>
  );

  return (
    <DashboardSection>
      <SectionTitle title={t('employer_castings.dashboard.requirements.requirements')} action={actionButtonRender()} />

      {(data?.length ?? 0) > 0 ? (
        data.map((requirement) => (
          <EmployerCastingRequirementCard
            key={requirement.id}
            data={requirement}
            roleOptions={roleOptions}
            sectionId={sectionId}
          />
        ))
      ) : (
        <Label className="w-full text-center text-[var(--color-secondary-grey-fonts)] pt-10">
          {t('employer_castings.page.empty_requirements')}
        </Label>
      )}
    </DashboardSection>
  );
};

export default EmployerCastingRequirementsEditSection;
