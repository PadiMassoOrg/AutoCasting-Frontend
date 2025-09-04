import { useParams } from 'react-router-dom';
import { BasicInfoSection, MediaSection, ViewerActions } from '../components';
import ProfileInfoCarousel from '../components/Details/ProfileInfoCarousel';
import SocialMediaSection from '../components/SocialMediaSection';
import { usePublicProfile } from '../hooks/usePublicProfile';

const PublicProfilePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error } = usePublicProfile(slug!);

  // TODO - Verify Flow
  if (isLoading) return <p>Cargando perfil público...</p>;
  if (error || !data) return <p>Error al cargar el perfil</p>;

  const { basicInfo, socialMedia, media } = data;

  return (
    <div className="relative pt-3 pb-10 flex flex-col gap-3 justify-center">
      <ViewerActions></ViewerActions>
      <BasicInfoSection data={basicInfo}></BasicInfoSection>
      <MediaSection data={media}></MediaSection>
      <ProfileInfoCarousel profile={data}></ProfileInfoCarousel>
      <SocialMediaSection data={socialMedia}></SocialMediaSection>
    </div>
  );
};

export default PublicProfilePage;
