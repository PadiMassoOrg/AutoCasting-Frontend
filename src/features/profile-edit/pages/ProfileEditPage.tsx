import { useLocation } from 'react-router-dom';
import ProfileEditShell from '../components/ProfileEditShell';
import { useProfile } from '../hooks/useProfile';

const ProfileEditPage = () => {
  const { data, isLoading, error } = useProfile();
  const location = useLocation();
  // TODO - Crear components Loading y Error (Ver Figma)
  if (isLoading) return <p>Cargando perfil...</p>;
  if (error) return <p>Error al cargar el perfil</p>;

  if (data) return <ProfileEditShell profile={data} key={location.key} />;
};

export default ProfileEditPage;
