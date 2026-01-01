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

const EmployerCastingPage = () => {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const { data, error, isLoading } = useCastingDetailsBySlug(slug!);

  if (isLoading || !data) return null;
  if (error) return <ServerError />;

  const { basicInfoSection, rolesSection, requirementsSection } = data;

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
      render: () => <EmployerCastingRequirementsEditSection sectionId={requirementsSection.id} />,
    },
    {
      key: 'remuneration',
      label: t('employer_castings.dashboard.remuneration.remuneration'),
      render: () => <EmployerCastingRemunerationEditSection />,
    },
  ];

  return <DashboardShell title={t('employer_castings.dashboard.title_new')} sections={sections}></DashboardShell>;
};

export default EmployerCastingPage;
