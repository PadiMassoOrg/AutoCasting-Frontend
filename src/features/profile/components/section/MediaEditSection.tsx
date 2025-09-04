import { Separator } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import type { Media } from '../../types/profile.types';
import { MediaPhotosForm, MediaVideosForm } from '../form';

const MediaEditSection = ({ media, supabaseId }: { media: Media; supabaseId: string }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full flex flex-col gap-5">
      <h3 className="font-bold text-base">{t('profile.media.photos')}</h3>
      <MediaPhotosForm media={media} supabaseId={supabaseId}></MediaPhotosForm>
      <Separator className="opacity-20 my-8"></Separator>
      <MediaVideosForm data={media}></MediaVideosForm>
    </div>
  );
};

export default MediaEditSection;
