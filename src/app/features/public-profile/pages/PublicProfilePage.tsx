import { Separator } from 'autocasting-ui-library-padimasso';
import { useParams } from 'react-router-dom';
import ImageCarousel from '../../../shared/components/ImageCarousel/ImageCarousel';
import ServerError from '../../../shared/components/ServerError/ServerError';
import { LG_SCREEN_SIZE, useMedia, XL_SCREEN_SIZE } from '../../../shared/hooks/useMedia';
import { TalentProfileModeToggle } from '../../talent/talent-profile-edit/components';
import { BasicInfoSection, SocialMediaSection, VideoSection, ViewerActions } from '../components';
import ProfileInfoCarousel from '../components/Details/ProfileInfoCarousel';
import { usePublicProfile } from '../hooks/usePublicProfile';

const NAVBAR = 70;
const TOP_MARGIN = '5rem';

const PublicProfilePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, error, isLoading } = usePublicProfile(slug!);
  const isDesktop = useMedia(LG_SCREEN_SIZE);
  const isDesktopXL = useMedia(XL_SCREEN_SIZE);

  if (isLoading || !data) return null;
  if (error) return <ServerError />;

  const { socialMedia, media } = data;

  const mergePictures = (): string[] =>
    [media.headshotImageUrl, media.fullBodyImageUrl, ...(media.otherPicturesUrl ?? [])].filter(
      (u): u is string => typeof u === 'string' && u.trim().length > 0
    );
  const images = mergePictures();
  const hasImages = images.length > 0;

  if (isDesktop && !isDesktopXL) {
    return (
      <article className="relative w-full flex flex-col gap-2">
        <BasicInfoSection data={data} />
        <div className="grid gap-10 grid-cols-[1fr_1fr] h-[690px] max-h-[690px] min-h-0">
          <section className="min-w-0 min-h-0">
            <ImageCarousel images={hasImages ? images : null} isDesktop />
          </section>
          <aside className="min-w-0 min-h-0 h-full overflow-auto">
            <ProfileInfoCarousel profile={data} className="h-full" />
          </aside>
        </div>
        <Separator className="opacity-25 my-12" />
        <VideoSection data={media} />
        <Separator className="opacity-25 my-12" />
      </article>
    );
  }

  if (isDesktopXL) {
    return (
      <article className="relative w-full">
        <div
          className="flex flex-col gap-2"
          style={{
            height: `calc(100svh - ${NAVBAR}px - ${TOP_MARGIN})`,
            minHeight: '500px',
            maxHeight: '800px',
          }}
        >
          <BasicInfoSection data={data} />

          {/* 
            Col 1: ocupa todo lo que sobra  -> minmax(260px, 1fr)
            Col 2: auto con tope de 500px   -> minmax(260, 500px)
            Col 3: auto con tope de 280px    ->  minmax(260px, 280)
          */}
          <div className="flex-1 min-h-0 grid gap-6 grid-cols-[minmax(260px,1fr)_minmax(260px,474px)_minmax(260px,280px)] items-stretch">
            {/* Fotos */}
            <div className="min-w-0 h-full min-h-0">
              <ImageCarousel images={hasImages ? images : null} isDesktop isDesktopXL />
            </div>

            {/* Profile info (se auto–ajusta, máx 500px por el grid) */}
            <div className="min-w-0 h-full min-h-0 overflow-auto">
              <ProfileInfoCarousel profile={data} className="h-full" />
            </div>

            {/* Videos (columna fija de 350px) */}
            <div className="min-w-0 h-full min-h-0 overflow-auto flex flex-col">
              <VideoSection data={media} />
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <div className="relative pt-3 pb-24 flex flex-col gap-4">
      <ViewerActions />
      <BasicInfoSection data={data} />
      <ImageCarousel images={hasImages ? images : null} />
      <div className="flex flex-col items-center justify-center mt-12">
        <SocialMediaSection data={socialMedia} />
      </div>
      <Separator className="opacity-25 my-10" />
      <ProfileInfoCarousel profile={data} />
      <Separator className="opacity-25 my-10" />
      <VideoSection data={media} />
      <TalentProfileModeToggle />
    </div>
  );
};

export default PublicProfilePage;
