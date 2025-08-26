import { useParams } from 'react-router-dom';
import { usePublicProfile } from '../hooks/usePublicProfile';
import { Separator } from 'autocasting-ui-library-padimasso';
import { ViewerActions, BasicInfoSection, MediaSection } from '../components/public';
import ProfileInfoCarousel from '../components/public/Details/ProfileInfoCarousel';
import SocialMediaSection from '../components/public/SocialMediaSection';

const PublicProfilePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error } = usePublicProfile(slug!);

  if (isLoading) return <p>Cargando perfil público...</p>;
  if (error || !data) return <p>Error al cargar el perfil</p>;
  const { basicInfo, socialMedia, media } = data;

  return (
    <div className="relative pt-3 pb-10 flex flex-col gap-3 justify-center">
      <ViewerActions></ViewerActions>
      <BasicInfoSection data={basicInfo}></BasicInfoSection>
      <MediaSection data={media}></MediaSection>
      <ProfileInfoCarousel profile={data}></ProfileInfoCarousel>
      <Separator className="opacity-25 my-12"></Separator>
      <SocialMediaSection data={socialMedia}></SocialMediaSection>
    </div>
  );
};

export default PublicProfilePage;
