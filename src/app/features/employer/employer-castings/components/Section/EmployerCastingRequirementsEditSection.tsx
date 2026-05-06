import { DashboardLoadingLabel, Label, type RadioOption } from 'autocasting-ui-library-padimasso';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ServerError from '../../../../../shared/components/ServerError/ServerError';
import { useEmployerCastingIds } from '../../context/EmployerCastingContext';
import { useSyncCastingSectionStatus } from '../../context/useSyncCastingSectionStatus';
import { useSectionRequirements } from '../../hooks/section/useSectionRequirements';
import { useSectionRoles } from '../../hooks/section/useSectionRoles';
import type { EmployerCastingRequirementCardResponse } from '../../types/employerCastings.types';
import { EmployerCastingRequirementCard } from '../Card';

const EMPTY_ARR: any[] = [];

const EmployerCastingRequirementsEditSection = ({ sectionId }: { sectionId: string }) => {
  const { t } = useTranslation();
  const { rolesSectionId } = useEmployerCastingIds();

  const {
    data: requirementsSection,
    isLoading: isRequirementsLoading,
    error: requirementsError,
  } = useSectionRequirements(sectionId);

  const { data: rolesSection, isLoading: isRolesLoading, error: rolesError } = useSectionRoles(rolesSectionId);

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

  useSyncCastingSectionStatus('requirements', requirementsSection?.sectionStatus);

  if (isRequirementsLoading || isRolesLoading) return <DashboardLoadingLabel />;
  if (requirementsError || rolesError) return <ServerError />;
  if (!requirementsSection || !rolesSection) return <DashboardLoadingLabel />;

  return requirementsForUi.length > 0 ? (
    <article className="flex flex-col gap-4">
      {requirementsForUi.map((requirement) => (
        <EmployerCastingRequirementCard
          key={requirement.id}
          data={requirement}
          roleOptions={roleOptions}
          sectionId={sectionId}
        />
      ))}
    </article>
  ) : (
    <Label className="w-full text-center text-[var(--color-secondary-grey-fonts)] pt-10">
      {t('employer_castings.page.empty_requirements')}
    </Label>
  );
};

export default EmployerCastingRequirementsEditSection;
