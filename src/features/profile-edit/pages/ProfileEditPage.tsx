import { useLocation } from 'react-router-dom';
import PageLoading from '../../../shared/components/PageLoading/PageLoading';
import ServerError from '../../../shared/components/ServerError/ServerError';
import ProfileEditShell from '../components/ProfileEditShell';
import { useProfile } from '../hooks/useProfile';

const ProfileEditPage = () => {
  const { data, isLoading, error } = useProfile();
  const location = useLocation();

  if (isLoading) return <PageLoading></PageLoading>;
  if (error || !data) return <ServerError></ServerError>;
  if (data) return <ProfileEditShell profile={data} key={location.key} />;
};

export default ProfileEditPage;
