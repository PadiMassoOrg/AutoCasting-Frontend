import { DashboardShell } from '../../../../layouts/components';
import ServerError from '../../../../shared/components/ServerError/ServerError';
import { EmployerProfileBasicInfoEditSection } from '../components/Section';
import { useEmployerProfile } from '../hooks/useEmployerProfile';

const EmployerProfileEditPage = () => {
  const { data, error, isLoading } = useEmployerProfile();

  if (isLoading || !data) return null;
  if (error) return <ServerError />;

  return (
    <div className="relative h-full flex flex-col">
      <div className="flex-1 min-h-0">
        <DashboardShell>
          <EmployerProfileBasicInfoEditSection data={data}></EmployerProfileBasicInfoEditSection>
        </DashboardShell>
      </div>
    </div>
  );
};

export default EmployerProfileEditPage;
