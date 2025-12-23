import { useTranslation } from 'react-i18next';
import { DashboardShell } from '../../../../layouts/components';
import type { DashboardSection } from '../../../../layouts/components/DashboardShell';
import {
  EmployerCastingBasicInfoEditSection,
  EmployerCastingRemunerationEditSection,
  EmployerCastingRequirementsEditSection,
  EmployerCastingRolesEditSection,
} from '../components/Section';

const EmployerCastingPage = () => {
  const { t } = useTranslation();
  const sections: DashboardSection[] = [
    {
      key: 'basic',
      label: t('employer_castings.dashboard.basic_info.basic_info'),
      render: () => <EmployerCastingBasicInfoEditSection />,
    },
    {
      key: 'roles',
      label: t('employer_castings.dashboard.roles.roles'),
      render: () => <EmployerCastingRolesEditSection />,
    },
    {
      key: 'requirements',
      label: t('employer_castings.dashboard.requirements.requirements'),
      render: () => <EmployerCastingRequirementsEditSection />,
    },
    {
      key: 'remuneration',
      label: t('employer_castings.dashboard.remuneration.remuneration'),
      render: () => <EmployerCastingRemunerationEditSection />,
    },
  ];

  // TODO: Handle TITLE EDIT OR NEW
  return <DashboardShell title={t('employer_castings.dashboard.title_new')} sections={sections}></DashboardShell>;
};

export default EmployerCastingPage;
