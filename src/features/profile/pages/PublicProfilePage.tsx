import { useParams } from 'react-router-dom';
import { usePublicProfile } from '../hooks/usePublicProfile';
import { useTranslation } from 'react-i18next';

const PublicProfilePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { data, isLoading, error } = usePublicProfile(slug!);

  if (isLoading) return <p>Cargando perfil público...</p>;
  if (error || !data) return <p>Error al cargar el perfil</p>;
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{data.name}</h1>
      <p>Email: {data.email}</p>
      <p>Rol: {t('general.' + data.roleStringCode)}</p>
      <p>Plan: {t('general.' + data.planStringCode)}</p>
    </div>
  );
};

export default PublicProfilePage;
