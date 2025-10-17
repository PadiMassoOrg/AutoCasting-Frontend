import { useLocation } from 'react-router-dom';
import PageLoading from '../../../../../shared/components/PageLoading/PageLoading';
import ServerError from '../../../../../shared/components/ServerError/ServerError';
import TalentProfileEditShell from '../components/TalentProfileEditShell';
import { useTalentProfile } from '../hooks/useTalentProfile';

const TalentProfileEditPage = () => {
  const { data, isPending, error } = useTalentProfile();
  const location = useLocation();

  if (isPending) return <PageLoading></PageLoading>;
  if (error) return <ServerError></ServerError>;
  if (data)
    return (
      <div className="h-full">
        <TalentProfileEditShell profile={data} key={location.key} />
      </div>
    );
};

export default TalentProfileEditPage;
