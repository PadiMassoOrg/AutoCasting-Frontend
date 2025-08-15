import { useParams } from 'react-router-dom';
import { usePublicProfile } from '../hooks/usePublicProfile';
import { Separator } from 'autocasting-ui-library-padimasso';
import { ViewerActions, BasicInfoSection, MediaSection } from '../components/public';
import ProfileInfoCarousel from '../components/public/Details/PanelCarousel';
import SocialMediaSection from '../components/public/SocialMediaSection';
import MOCK_PROFILE from '../MOCK_PROFILE.json';

const PublicProfilePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error } = usePublicProfile(slug!);

  if (isLoading) return <p>Cargando perfil público...</p>;
  if (error || !data) return <p>Error al cargar el perfil</p>;
  const { basicInfo, socialMedia } = data;
  const media = MOCK_PROFILE.media;

  return (
    <div className="relative pt-3 pb-10 flex flex-col gap-3 justify-center">
      <ViewerActions></ViewerActions>
      <BasicInfoSection data={basicInfo}></BasicInfoSection>
      <MediaSection data={media}></MediaSection>
      <Separator className="opacity-25 my-12"></Separator>
      <ProfileInfoCarousel profile={data}></ProfileInfoCarousel>
      <Separator className="opacity-25 my-8"></Separator>
      <SocialMediaSection data={socialMedia}></SocialMediaSection>
    </div>
  );
};

export default PublicProfilePage;
