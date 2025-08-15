import { useProfile } from '../hooks/useProfile';
import ProfileEditShell from '../components/edit/ProfileEditShell';

const ProfileEditPage = () => {
  const { data, isLoading, error } = useProfile();

  if (isLoading) return <p>Cargando perfil...</p>;
  if (error) return <p>Error al cargar el perfil</p>;
  if (data)
    return (
      <div className="w-full flex flex-col items-center gap-6 mt-5">
        <ProfileEditShell profile={data} />
      </div>
    );
};

export default ProfileEditPage;
