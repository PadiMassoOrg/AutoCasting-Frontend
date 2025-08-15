import { Button } from 'autocasting-ui-library-padimasso';
import { useProfile } from '../hooks/useProfile';
import { useNavigate } from 'react-router-dom';
import ProfileEditShell from '../components/edit/ProfileEditShell';

const ProfileEditPage = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useProfile();

  if (isLoading) return <p>Cargando perfil...</p>;
  if (error) return <p>Error al cargar el perfil</p>;
  if (data)
    return (
      <div className="w-full flex flex-col items-center gap-6 mt-5">
        <ProfileEditShell profile={data} />
        <Button variant="primary" className="max-w-sm" onClick={() => navigate(`/profile/${data?.publicSlug}`)}>
          Ver Perfil
        </Button>
      </div>
    );
};

export default ProfileEditPage;
