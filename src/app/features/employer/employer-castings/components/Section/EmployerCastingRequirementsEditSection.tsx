import { Button, Label } from 'autocasting-ui-library-padimasso';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../../context/ModalContext';
import { DashboardSection } from '../../../../../layouts/components';
import ServerError from '../../../../../shared/components/ServerError/ServerError';
import type { RadioOption } from '../../../../../shared/components/Form/RadioGroupField';
import { Icon } from '../../../../../shared/components/Icon/Icon';
import { SectionTitle } from '../../../../../shared/components/Section';
import { useEmployerCastingIds } from '../../context/EmployerCastingContext';
import { useCastingRequirementCreateAutosave } from '../../hooks/autosaves';
import { useSectionRequirements } from '../../hooks/useSectionRequirements';
import { useSectionRoles } from '../../hooks/useSectionRoles';
import type { EmployerCastingRequirementCardResponse } from '../../types/employerCastings.types';
import type { CastingRequirementUpsertRequest } from '../../types/requests';
import EmployerCastingRequirementCard from '../EmployerCastingRequirementCard';
import CastingRequirementModal from '../Form/Requirement/CastingRequirementModal';

const EmployerCastingRequirementsEditSection = ({ sectionId }: { sectionId: string }) => {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModal();
  const { rolesSectionId } = useEmployerCastingIds();
  const {
    data: requirementsSection,
    isLoading: isRequirementsLoading,
    error: requirementsError,
  } = useSectionRequirements(sectionId);
  const { data: rolesSection, isLoading: isRolesLoading, error: rolesError } = useSectionRoles(rolesSectionId);
  const createRequirementMutation = useCastingRequirementCreateAutosave(sectionId);

  if (isRequirementsLoading || isRolesLoading) return null;
  if (requirementsError || rolesError) return <ServerError />;
  if (!requirementsSection || !rolesSection) return null;

  const rolesById = useMemo(() => {
    const map = new Map<string, string>();
    (rolesSection.roles ?? []).forEach((r) => {
      map.set(r.id, r.roleName ?? '');
    });
    return map;
  }, [rolesSection.roles]);

  const requirementsForUi: EmployerCastingRequirementCardResponse[] = useMemo(() => {
    const fallback = t('general.placeholder.role_name');
    return (requirementsSection.requirements ?? []).map((req: any) => {
      const roleName = req?.roleName ?? rolesById.get(req?.roleId) ?? fallback;
      return { ...req, roleName };
    });
  }, [requirementsSection.requirements, rolesById, t]);

  const roleOptions: RadioOption[] = useMemo(
    () =>
      (rolesSection.roles ?? []).map((r) => ({
        value: r.id,
        label: r.roleName ?? t('general.placeholder.role_name'),
      })),
    [rolesSection.roles, t]
  );

  const disabledRoleIds = useMemo(() => {
    const ids = new Set<string>();
    (requirementsSection.requirements ?? []).forEach((req: any) => {
      if (req?.roleId) ids.add(req.roleId);
    });
    return Array.from(ids);
  }, [requirementsSection.requirements]);

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

      {(requirementsForUi.length ?? 0) > 0 ? (
        requirementsForUi.map((requirement) => (
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
