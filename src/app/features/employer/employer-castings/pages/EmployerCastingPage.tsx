import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { DashboardShell } from '../../../../layouts/components';
import type { DashboardSection } from '../../../../layouts/components/DashboardShell';
import ServerError from '../../../../shared/components/ServerError/ServerError';
import {
  EmployerCastingBasicInfoEditSection,
  EmployerCastingRemunerationEditSection,
  EmployerCastingRequirementsEditSection,
  EmployerCastingRolesEditSection,
} from '../components/Section';
import { useCastingDetailsBySlug } from '../hooks/useCastingDetailsBySlug';
import { useCastingRoles } from '../hooks/useCastingRoles';

const EmployerCastingPage = () => {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();

  const detailsQuery = useCastingDetailsBySlug(slug);
  const rolesSectionId = detailsQuery.data?.rolesSection?.id;

  const rolesQuery = useCastingRoles(rolesSectionId);

  const lastRolesUpdatedAt = useRef<number | null>(null);

  useEffect(() => {
    if (!slug) return;
    if (!rolesSectionId) return;

    const ts = rolesQuery.dataUpdatedAt;
    if (!ts) return;

    if (lastRolesUpdatedAt.current == null) {
      lastRolesUpdatedAt.current = ts;
      return;
    }

    if (lastRolesUpdatedAt.current === ts) return;

    lastRolesUpdatedAt.current = ts;
    void detailsQuery.refetch();
  }, [slug, rolesSectionId, rolesQuery.dataUpdatedAt, detailsQuery]);

  if (detailsQuery.isLoading || !detailsQuery.data) return null;
  if (detailsQuery.error) return <ServerError />;

  const { basicInfoSection, rolesSection, requirementsSection } = detailsQuery.data;

  const rolesForRequirements = (rolesQuery.data ?? rolesSection.roles ?? []) as any;

  const sections: DashboardSection[] = [
    {
      key: 'basic',
      label: t('employer_castings.dashboard.basic_info.basic_info'),
      render: () => <EmployerCastingBasicInfoEditSection data={basicInfoSection} />,
    },
    {
      key: 'roles',
      label: t('employer_castings.dashboard.roles.roles'),
      render: () => <EmployerCastingRolesEditSection sectionId={rolesSection.id} />,
    },
    {
      key: 'requirements',
      label: t('employer_castings.dashboard.requirements.requirements'),
      render: () => (
        <EmployerCastingRequirementsEditSection sectionId={requirementsSection.id} roles={rolesForRequirements} />
      ),
    },
    {
      key: 'remuneration',
      label: t('employer_castings.dashboard.remuneration.remuneration'),
      render: () => <EmployerCastingRemunerationEditSection />,
    },
  ];

  return <DashboardShell title={t('employer_castings.dashboard.title_new')} sections={sections} />;
};

export default EmployerCastingPage;
