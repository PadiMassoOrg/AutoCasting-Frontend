import { DashboardLoadingLabel, DashboardSection, DashboardShell } from '../../../../layouts/components';
import ServerError from '../../../../shared/components/ServerError/ServerError';
import { EmployerProfileBasicInfoEditSection } from '../components/Section';
import { useEmployerProfile } from '../hooks/useEmployerProfile';

const EmployerProfileEditPage = () => {
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

  return (
    <DashboardShell>
      <EmployerProfileBasicInfoEditSection data={data}></EmployerProfileBasicInfoEditSection>
    </DashboardShell>
  );
};

export default EmployerProfileEditPage;
