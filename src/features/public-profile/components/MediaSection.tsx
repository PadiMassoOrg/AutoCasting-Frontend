import { useTranslation } from 'react-i18next';
import VideoPreviewCard from '../../../shared/components/Video/VideoPreviewCard';
import type { Media } from '../../profile-edit/types/profile.types';

const VideoSection = ({ data }: { data: Media }) => {
  const { t } = useTranslation();
  const { introductionVideoUrl, showReelVideoUrl } = data;

  const hasVideos = Boolean(introductionVideoUrl || showReelVideoUrl);

  return (
    <article className="w-full flex flex-col gap-2">
      {!hasVideos && (
        <div className="w-full">
          <h2 className="font-bold text-xl mb-3">{t('profile.page.videos')}</h2>
          <p className="text-[var(--color-secondary-grey)] font-base">{t('profile.page.no_videos')}</p>
        </div>
      )}

      {hasVideos && (
        <article>
          <h2 className="font-bold text-xl mb-3">{t('profile.page.videos')}</h2>
          {}
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
        </article>
      )}
    </article>
  );
};

export default VideoSection;
