import { useParams } from 'react-router-dom';
import { LG_SCREEN_SIZE, useMedia } from '../../../shared/hooks/useMedia';
import { BasicInfoSection, MediaSection, ViewerActions } from '../components';
import ProfileInfoCarousel from '../components/Details/ProfileInfoCarousel';
import SocialMediaSection from '../components/SocialMediaSection';
import { usePublicProfile } from '../hooks/usePublicProfile';

const PublicProfilePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error } = usePublicProfile(slug!);
  const isDesktop = useMedia(LG_SCREEN_SIZE);

  // TODO - Verify Flow
  if (isLoading) return <p>Cargando perfil público...</p>;
  if (error || !data) return <p>Error al cargar el perfil</p>;

  const { basicInfo, socialMedia, media } = data;

  return isDesktop ? (
    <article className="relative w-full flex flex-col gap-3">
      <BasicInfoSection data={basicInfo}></BasicInfoSection>
      <div className="relative flex flex-row gap-2 justify-center">
        <MediaSection data={media}></MediaSection>
        <ProfileInfoCarousel profile={data}></ProfileInfoCarousel>
        <SocialMediaSection data={socialMedia}></SocialMediaSection>
      </div>
    </article>
  ) : (
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
