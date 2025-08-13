import ImageCarousel from '../../../shared/components/ImageCarousel/ImageCarousel';
import { useTranslation } from 'react-i18next';
import VideoPreviewCard from '../../../shared/components/Video/VideoPreviewCard';
import Separator from '../../../shared/components/Separator/Separator';

type MediaProps = {
  data: {
    id: string;
    headshotImageUrl: string;
    fullBodyImageUrl: string;
    otherPicturesUrl: string[];
    introductionVideoUrl: string;
    showReelVideoUrl: string;
  };
};

const MediaSection = ({ data }: MediaProps) => {
  const { headshotImageUrl, fullBodyImageUrl, otherPicturesUrl, introductionVideoUrl, showReelVideoUrl } = data;
  const { t } = useTranslation();

  const mergePictures = () => {
    let newArray = [];
    newArray.push(headshotImageUrl);
    newArray.push(fullBodyImageUrl);
    otherPicturesUrl.map((i) => newArray.push(i));
    return newArray;
  };

  return (
    <article className="w-full flex flex-col gap-2">
      <ImageCarousel images={mergePictures()}></ImageCarousel>
      <Separator className="opacity-25 my-12"></Separator>
      <h2 className="font-bold text-xl mb-3">{t('profile.page.videos')}</h2>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <VideoPreviewCard videoUrl={introductionVideoUrl} />
          <p className="font-semibold">{t('profile.page.introduction_video')}</p>
        </div>
        <div className="flex flex-col gap-1">
          <VideoPreviewCard videoUrl={showReelVideoUrl} />
          <p className="font-semibold">{t('profile.page.showreel_video')}</p>
        </div>
      </div>
    </article>
  );
};

export default MediaSection;
