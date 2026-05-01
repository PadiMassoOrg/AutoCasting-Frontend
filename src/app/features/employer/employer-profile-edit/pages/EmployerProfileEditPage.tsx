import { DashboardLoadingLabel, DashboardSection, DashboardShell } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import ServerError from '../../../../shared/components/ServerError/ServerError';
import { EmployerProfileBasicInfoEditSection } from '../components/Section';
import { useEmployerProfile } from '../hooks/useEmployerProfile';

const EmployerProfileEditPage = () => {
  const { t } = useTranslation();
  const { data, error, isLoading } = useEmployerProfile();

  if (error && !data) return <ServerError />;
  if (isLoading || !data) {
    return (
      <DashboardShell>
        <DashboardSection>
          <DashboardLoadingLabel />
        </DashboardSection>
      </DashboardShell>
    );
  }

  const secitons = [
    {
      key: 'basic',
      label: t('profile.pills.basic_info'),
      render: () => <EmployerProfileBasicInfoEditSection data={data} />,
    },
  ];

  return <DashboardShell title={t('employer_profile.profile')} sections={secitons}></DashboardShell>;
};

export default EmployerProfileEditPage;
