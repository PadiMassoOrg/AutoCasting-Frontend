import type { DashboardShellSection } from 'autocasting-ui-library-padimasso';
import { DashboardLoadingLabel, DashboardShell } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import ServerError from '../../../../shared/components/ServerError/ServerError';
import { EmployerProfileBasicInfoEditSection } from '../components/Section';
import { useEmployerProfile } from '../hooks/useEmployerProfile';

const EmployerProfileEditPage = () => {
  const { t } = useTranslation();
  const { data, error, isLoading } = useEmployerProfile();

  if (error && !data) return <ServerError />;

  const loadingSections: DashboardShellSection[] = [
    {
      key: 'basic',
      label: t('profile.pills.basic_info'),
      sectionTitle: t('profile.pills.basic_info'),
      render: () => <DashboardLoadingLabel />,
    },
  ];

  const sections: DashboardShellSection[] =
    isLoading || !data
      ? loadingSections
      : [
          {
            key: 'basic',
            label: t('profile.pills.basic_info'),
            sectionTitle: t('profile.pills.basic_info'),
            render: () => <EmployerProfileBasicInfoEditSection data={data} />,
          },
        ];

  return <DashboardShell title={t('employer_profile.profile')} sections={sections}></DashboardShell>;
};

export default EmployerProfileEditPage;
