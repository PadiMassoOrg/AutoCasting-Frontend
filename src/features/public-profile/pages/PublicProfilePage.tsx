import { Separator } from 'autocasting-ui-library-padimasso';
import { useParams } from 'react-router-dom';
import ImageCarousel from '../../../shared/components/ImageCarousel/ImageCarousel';
import { LG_SCREEN_SIZE, XL_SCREEN_SIZE, useMedia } from '../../../shared/hooks/useMedia';
import { BasicInfoSection, MediaSection, ViewerActions } from '../components';
import ProfileInfoCarousel from '../components/Details/ProfileInfoCarousel';
import SocialMediaSection from '../components/SocialMediaSection';
import { usePublicProfile } from '../hooks/usePublicProfile';

const NAVBAR = 70;
const TOP_MARGIN = '5rem';

const PublicProfilePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error } = usePublicProfile(slug!);
  const isDesktop = useMedia(LG_SCREEN_SIZE);
  const isDesktopXL = useMedia(XL_SCREEN_SIZE);

  if (isLoading) return <p>Cargando perfil público...</p>;
  if (error || !data) return <p>Error al cargar el perfil</p>;

  const { basicInfo, socialMedia, media } = data;

  const mergePictures = (): string[] =>
    [media.headshotImageUrl, media.fullBodyImageUrl, ...(media.otherPicturesUrl ?? [])].filter(
      (u): u is string => typeof u === 'string' && u.trim().length > 0
    );

  const images = mergePictures();
  const hasImages = images.length > 0;

  if (isDesktop && !isDesktopXL) {
    return (
      <article className="relative w-full flex flex-col gap-3">
        <BasicInfoSection data={basicInfo} />
        <div className="grid gap-10 grid-cols-[1.4fr_1fr] h-[700px] max-h-[700px] min-h-0">
          <section className="min-w-0 min-h-0 h-full">
            <ImageCarousel images={hasImages ? images : null} isDesktop />
          </section>
          <aside className="min-w-0 min-h-0 h-full overflow-auto">
            <ProfileInfoCarousel profile={data} className="h-full" />
          </aside>
        </div>
        <Separator className="opacity-25 my-12" />
        <MediaSection data={media} />
        <Separator className="opacity-25 my-12" />
        <SocialMediaSection data={socialMedia} />
      </article>
    );
  }

  if (isDesktopXL) {
    return (
      <article className="relative w-full">
        <div
          className="flex flex-col max-h-[calc(100svh-var(--nav)-var(--top))]"
          style={{ ['--nav' as any]: `${NAVBAR}px`, ['--top' as any]: TOP_MARGIN }}
        >
          <BasicInfoSection data={basicInfo} />
          <div className="flex-1 min-h-0 grid gap-6 grid-cols-[minmax(0,1.5fr)_minmax(260px,0.9fr)_minmax(0,0.6fr)] items-stretch">
            <div className="min-w-0 min-h-0 h-full">
              <ImageCarousel images={hasImages ? images : null} isDesktop isDesktopXL />
            </div>
            <div className="min-w-0 min-h-0 h-full overflow-auto">
              <ProfileInfoCarousel profile={data} className="h-full" />
            </div>
            <div className="min-w-0 min-h-0 h-full overflow-auto flex flex-col gap-5">
              <MediaSection data={media} />
              <Separator className="opacity-25 my-6" />
              <SocialMediaSection data={socialMedia} />
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <div className="relative pt-3 pb-10 flex flex-col gap-3 justify-center">
      <ViewerActions />
      <BasicInfoSection data={basicInfo} />
      <ImageCarousel images={hasImages ? images : null} />
      <Separator className="opacity-25 my-12" />
      <MediaSection data={media} />
      <Separator className="opacity-25 my-12" />
      <ProfileInfoCarousel profile={data} />
      <Separator className="opacity-25 my-12" />
      <SocialMediaSection data={socialMedia} />
    </div>
  );
};

export default PublicProfilePage;
