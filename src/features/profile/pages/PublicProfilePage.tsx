// import { useParams } from 'react-router-dom';
// import { usePublicProfile } from '../hooks/usePublicProfile';
import { useTranslation } from 'react-i18next';
import mock from '../MOCK_PROFILE.json';
import { ViewerActions, BasicInfoSection, MediaSection } from '../components/';
import Separator from '../../../shared/components/Separator/Separator';
import ProfileInfoCarousel from '../components/ProfileInfo/PanelCarousel';

const PublicProfilePage = () => {
  // const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  // const { data, isLoading, error } = usePublicProfile(slug!);

  const error = false;
  const data = mock;
  const isLoading = false;

  const { basicInfo, contact, socialMedia, media } = data;

  if (isLoading) return <p>Cargando perfil público...</p>;
  if (error || !data) return <p>Error al cargar el perfil</p>;

  return (
    <div className="pb-48 pt-3 flex flex-col gap-3 justify-center">
      <ViewerActions></ViewerActions>
      <BasicInfoSection data={basicInfo}></BasicInfoSection>
      <MediaSection data={media}></MediaSection>
      <Separator className="opacity-25 my-12"></Separator>
      <ProfileInfoCarousel profile={data}></ProfileInfoCarousel>
    </div>
  );
};

export default PublicProfilePage;
