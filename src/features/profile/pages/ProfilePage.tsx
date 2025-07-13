import { Button } from 'autocasting-ui-library-padimasso';
import { useProfile } from '../hooks/useProfile';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useProfile();

  if (isLoading) return <p>Cargando perfil...</p>;
  if (error) return <p>Error al cargar el perfil</p>;
  return (
    <div className="flex flex-col items-center gap-6">
      <h1>Bienvenido, {data?.name}</h1>
      <Button variant="primary" className="max-w-sm" onClick={() => navigate(`/profile/${data?.publicSlug}`)}>
        Ver Perfil
      </Button>
    </div>
  );
};

export default ProfilePage;
