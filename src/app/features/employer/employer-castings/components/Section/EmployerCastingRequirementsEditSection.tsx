import { Button, Icon, Label, type RadioOption } from 'autocasting-ui-library-padimasso';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../../context/ModalContext';
import { DashboardLoadingLabel, DashboardSection } from '../../../../../layouts/components';
import { SectionTitle } from '../../../../../shared/components/Section';
import ServerError from '../../../../../shared/components/ServerError/ServerError';
import { useEmployerCastingIds } from '../../context/EmployerCastingContext';
import { useSyncCastingSectionStatus } from '../../context/useSyncCastingSectionStatus';
import { useCastingRequirementCreateAutosave } from '../../hooks/autosaves';
import type { CastingRequirementFormKey } from '../../schemas/formSchema';
import { useSectionRequirements } from '../../hooks/section/useSectionRequirements';
import { useSectionRoles } from '../../hooks/section/useSectionRoles';
import type { EmployerCastingRequirementCardResponse } from '../../types/employerCastings.types';
import type { CastingRequirementUpsertRequest } from '../../types/requests';
import { EmployerCastingRequirementCard } from '../Card';
import CastingRequirementModal from '../Form/Requirement/CastingRequirementModal';

const EMPTY_ARR: any[] = [];

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

  const roles = rolesSection?.roles ?? EMPTY_ARR;
  const requirements = requirementsSection?.requirements ?? EMPTY_ARR;

  const rolesById = useMemo(() => {
    const map = new Map<string, string>();
    roles.forEach((r: any) => map.set(r.id, r.roleName ?? ''));
    return map;
  }, [roles]);

  const roleOptions: RadioOption[] = useMemo(
    () =>
      roles.map((r: any) => ({
        value: r.id,
        label: r.roleName ?? t('general.placeholder.role_name'),
      })),
    [roles, t]
  );

  const requirementsForUi: EmployerCastingRequirementCardResponse[] = useMemo(() => {
    const fallback = t('general.placeholder.role_name');
    return requirements.map((req: any) => {
      const roleName = req?.roleName ?? rolesById.get(req?.roleId) ?? fallback;
      return { ...req, roleName };
    });
  }, [requirements, rolesById, t]);

  const disabledRoleIds = useMemo(() => {
    const ids = new Set<string>();
    requirements.forEach((req: any) => {
      if (req?.roleId) ids.add(req.roleId);
    });
    return Array.from(ids);
  }, [requirements]);

  useSyncCastingSectionStatus('requirements', requirementsSection?.sectionStatus);

  if (isRequirementsLoading || isRolesLoading) {
    return (
      <DashboardSection>
        <DashboardLoadingLabel />
      </DashboardSection>
    );
  }
  if (requirementsError || rolesError) return <ServerError />;
  if (!requirementsSection || !rolesSection) {
    return (
      <DashboardSection>
        <DashboardLoadingLabel />
      </DashboardSection>
    );
  }

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

  const actionButtonRender = () => (
    <Button variant="primary" disabled={roleOptions.length === 0} onClick={handleOpenModal}>
      <span className="flex flex-row items-center gap-2">
        <Icon name="plus" variant="white" size={16}></Icon>
        {t('general.add')}
      </span>
    </Button>
  );

  return (
    <DashboardSection>
      <SectionTitle title={t('employer_castings.dashboard.requirements.requirements')} action={actionButtonRender()} />

      {requirementsForUi.length > 0 ? (
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
