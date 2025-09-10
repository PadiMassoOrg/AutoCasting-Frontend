import { Separator } from 'autocasting-ui-library-padimasso';
import { useParams } from 'react-router-dom';
import ImageCarousel from '../../../shared/components/ImageCarousel/ImageCarousel';
import { LG_SCREEN_SIZE, LG_SCREEN_XL_SIZE, useMedia } from '../../../shared/hooks/useMedia';
import { BasicInfoSection, MediaSection, ViewerActions } from '../components';
import ProfileInfoCarousel from '../components/Details/ProfileInfoCarousel';
import SocialMediaSection from '../components/SocialMediaSection';
import { usePublicProfile } from '../hooks/usePublicProfile';

const PublicProfilePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error } = usePublicProfile(slug!);
  const isDesktop = useMedia(LG_SCREEN_SIZE);
  const isBigger = useMedia(LG_SCREEN_XL_SIZE);
  console.log(isBigger);

  // TODO - Verify Flow
  if (isLoading) return <p>Cargando perfil público...</p>;
  if (error || !data) return <p>Error al cargar el perfil</p>;

  const { basicInfo, socialMedia, media } = data;

  const mergePictures = (): string[] => {
    return [media.headshotImageUrl, media.fullBodyImageUrl, ...(media.otherPicturesUrl ?? [])].filter(
      (u): u is string => typeof u === 'string' && u.trim().length > 0
    );
  };

  const images = mergePictures();
  const hasImages = images.length > 0;

  if (isDesktop && !isBigger) {
    return (
      <article className="relative w-full flex flex-col gap-3">
        <BasicInfoSection data={basicInfo}></BasicInfoSection>
        <div className="relative flex flex-row gap-2 justify-center">
          <div className="w-full">
            <ImageCarousel images={hasImages ? images : null} />
          </div>
          <div className="flex-1">
            <ProfileInfoCarousel profile={data}></ProfileInfoCarousel>
          </div>
        </div>
        <Separator className="opacity-25 my-12" />
        <MediaSection data={media}></MediaSection>
        <Separator className="opacity-25 my-12" />
        <SocialMediaSection data={socialMedia}></SocialMediaSection>
      </article>
    );
  } else if (isBigger) {
    return (
      <article className="relative w-full flex flex-col gap-3">
        <BasicInfoSection data={basicInfo} />
        <div className="grid gap-6 grid-cols-[minmax(0,1fr)_minmax(260px,1fr)_minmax(0,0.6fr)] items-start">
          <div className="min-w-0">
            <ImageCarousel images={hasImages ? images : null} />
          </div>
          <div className="min-w-0 lg:sticky lg:top-4">
            <ProfileInfoCarousel profile={data} />
          </div>
          <div className="min-w-0 flex flex-col gap-5">
            <MediaSection data={media} />
            <Separator className="opacity-25 my-6" />
            <SocialMediaSection data={socialMedia} />
          </div>
        </div>
      </article>
    );
  } else {
    return (
      <div className="relative pt-3 pb-10 flex flex-col gap-3 justify-center">
        <ViewerActions></ViewerActions>
        <BasicInfoSection data={basicInfo}></BasicInfoSection>
        <ImageCarousel images={hasImages ? images : null} />
        <Separator className="opacity-25 my-12" />
        <MediaSection data={media}></MediaSection>
        <Separator className="opacity-25 my-12" />
        <ProfileInfoCarousel profile={data}></ProfileInfoCarousel>
        <Separator className="opacity-25 my-12" />
        <SocialMediaSection data={socialMedia}></SocialMediaSection>
      </div>
    );
  }
};

export default PublicProfilePage;
