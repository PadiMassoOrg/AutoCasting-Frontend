import { Separator } from 'autocasting-ui-library-padimasso';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import ImageCarousel from '../../../shared/components/ImageCarousel/ImageCarousel';
import { LG_SCREEN_SIZE, XL_SCREEN_SIZE, useMedia } from '../../../shared/hooks/useMedia';
import { ProfileCompletionCard } from '../../profile-edit/components/ProfileCompletionCard/ProfileCompletionCard';
import { useProfile } from '../../profile-edit/hooks/useProfile';
import { computeProfileProgress, type ProfileProgress } from '../../profile-edit/services/computeProfileProgress';
import { BasicInfoSection, SocialMediaSection, VideoSection, ViewerActions } from '../components';
import ProfileInfoCarousel from '../components/Details/ProfileInfoCarousel';
import { usePublicProfile } from '../hooks/usePublicProfile';

const NAVBAR = 70;
const TOP_MARGIN = '5rem';

const PublicProfilePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: myProfile } = useProfile();
  const { data, isLoading, error } = usePublicProfile(slug!);
  const isDesktop = useMedia(LG_SCREEN_SIZE);
  const isDesktopXL = useMedia(XL_SCREEN_SIZE);

  const isOwner = !!myProfile?.publicSlug && myProfile.publicSlug === slug;
  const progress = useMemo<ProfileProgress | null>(() => {
    if (!isOwner) return null;
    const src = myProfile ?? data;
    return computeProfileProgress(src);
  }, [isOwner, myProfile, data]);

  // TODO - Verify
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
        <VideoSection data={media} />
        <Separator className="opacity-25 my-12" />
        <SocialMediaSection
          data={socialMedia}
          className="lg:w-full lg:flex lg:flex-row lg:items-center lg:justify-end lg:gap-4"
        />
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
            maxHeight: '850px',
            ['--media-col-w' as any]: '200px',
          }}
        >
          <BasicInfoSection data={basicInfo} />
          <div className="flex-1 min-h-0 grid gap-6 grid-cols-[max-content_minmax(260px,1fr)_var(--media-col-w)] items-stretch">
            <div className="min-w-0 min-h-0 h-full">
              <ImageCarousel images={hasImages ? images : null} isDesktop isDesktopXL />
            </div>
            <div className="min-w-0 min-h-0 h-full overflow-auto">
              <ProfileInfoCarousel profile={data} className="h-full" />
            </div>
            <div className="min-h-0 h-full overflow-auto flex flex-col justify-between">
              <VideoSection data={media} />
              <div className="">
                <Separator className="opacity-25 mb-4" />
                <SocialMediaSection data={socialMedia} className="flex flex-row items-center justify-between" />
                <Separator className="opacity-25 mt-4" />
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <div className="relative pt-3 pb-10 flex flex-col gap-3 justify-center">
      <div className="mb-2 grid place-items-center">
        {isOwner && progress && <ProfileCompletionCard progress={progress} isEdit={false} />}
      </div>
      <ViewerActions />
      <BasicInfoSection data={basicInfo} />
      <ImageCarousel images={hasImages ? images : null} />
      <Separator className="opacity-25 my-12" />
      <VideoSection data={media} />
      <Separator className="opacity-25 my-12" />
      <ProfileInfoCarousel profile={data} />
      <Separator className="opacity-25 my-12" />
      <SocialMediaSection data={socialMedia} className="flex flex-col items-center gap-4" />
    </div>
  );
};

export default PublicProfilePage;
