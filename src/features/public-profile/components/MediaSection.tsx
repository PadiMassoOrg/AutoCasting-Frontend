import { Separator } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import ImageCarousel from '../../../shared/components/ImageCarousel/ImageCarousel';
import VideoPreviewCard from '../../../shared/components/Video/VideoPreviewCard';
import type { Media } from '../../profile/types/profile.types';

const MediaSection = ({ data }: { data: Media }) => {
  const { headshotImageUrl, fullBodyImageUrl, otherPicturesUrl, introductionVideoUrl, showReelVideoUrl } = data;
  const { t } = useTranslation();

  const mergePictures = (): string[] => {
    return [headshotImageUrl, fullBodyImageUrl, ...(otherPicturesUrl ?? [])].filter(
      (u): u is string => typeof u === 'string' && u.trim().length > 0
    );
  };

  const images = mergePictures();
  const hasImages = images.length > 0;
  const hasVideos = Boolean(introductionVideoUrl || showReelVideoUrl);

  return (
    <article className="w-full flex flex-col gap-2">
      <ImageCarousel images={hasImages ? images : null} />

      {!hasVideos && <Separator className="opacity-25 my-12" />}

      {hasVideos && (
        <>
          <Separator className="opacity-25 my-12" />
          <h2 className="font-bold text-xl mb-3">{t('profile.page.videos')}</h2>
          <div className="flex flex-col gap-4">
            {introductionVideoUrl && (
              <div className="flex flex-col gap-1">
                <VideoPreviewCard videoUrl={introductionVideoUrl} />
                <p className="font-semibold">{t('profile.page.introduction_video')}</p>
              </div>
            )}
            {showReelVideoUrl && (
              <div className="flex flex-col gap-1">
                <VideoPreviewCard videoUrl={showReelVideoUrl} />
                <p className="font-semibold">{t('profile.page.showreel_video')}</p>
              </div>
            )}
          </div>
          <Separator className="opacity-25 my-12" />
        </>
      )}
    </article>
  );
};

export default MediaSection;
