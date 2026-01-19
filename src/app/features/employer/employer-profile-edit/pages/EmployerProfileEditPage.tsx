import { DashboardShell } from '../../../../layouts/components';
import ServerError from '../../../../shared/components/ServerError/ServerError';
import { EmployerProfileBasicInfoEditSection } from '../components/Section';
import { useEmployerProfile } from '../hooks/useEmployerProfile';

const EmployerProfileEditPage = () => {
  const { data, error, isLoading } = useEmployerProfile();

  if (isLoading || !data) return null;
  if (error) return <ServerError />;

  return (
    <DashboardShell>
      <EmployerProfileBasicInfoEditSection data={data}></EmployerProfileBasicInfoEditSection>
    </DashboardShell>
  );
};

export default EmployerProfileEditPage;
