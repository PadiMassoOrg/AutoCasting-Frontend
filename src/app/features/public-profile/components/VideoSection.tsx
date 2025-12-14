import { useTranslation } from 'react-i18next';
import VideoPreviewCard from '../../../shared/components/Video/VideoPreviewCard';
import { LG_SCREEN_SIZE, useMedia, XL_SCREEN_SIZE } from '../../../shared/hooks/useMedia';
import type { Media } from '../../talent/talent-profile-edit/types/talentProfile.types';

const VideoSection = ({ data }: { data: Media }) => {
  const { t } = useTranslation();
  const isDesktop = useMedia(LG_SCREEN_SIZE);
  const isDesktopXL = useMedia(XL_SCREEN_SIZE);
  const { introductionVideoUrl, showReelVideoUrl } = data;

  const hasVideos = Boolean(introductionVideoUrl || showReelVideoUrl);
  const useGrid = isDesktop && !isDesktopXL;

  const containerCls = useGrid ? 'grid grid-cols-4 gap-6 items-start p-6' : 'flex flex-col gap-4 p-6';
  const itemCls = useGrid ? 'flex flex-col gap-1' : 'flex flex-col gap-1';

  return (
    <article className="w-full h-full flex flex-col gap-2 bg-[var(--color-primary-white)] rounded-lg border-[var(--color-secondary-outline)] border">
      {!hasVideos && (
        <div className="w-full p-4">
          <p className="text-[var(--color-secondary-grey)] font-base text-center">{t('profile.page.no_videos')}</p>
        </div>
      )}

      {hasVideos && (
        <div className={containerCls}>
          {introductionVideoUrl && (
            <div className={itemCls}>
              <VideoPreviewCard videoUrl={introductionVideoUrl} />
              <p className="font-semibold text-base lg:text-[14px]">{t('profile.page.introduction_video')}</p>
            </div>
          )}
          {showReelVideoUrl && (
            <div className={itemCls}>
              <VideoPreviewCard videoUrl={showReelVideoUrl} />
              <p className="font-semibold text-base lg:text-[14px]">{t('profile.page.showreel_video')}</p>
            </div>
          )}
        </div>
      )}
    </article>
  );
};

export default VideoSection;
