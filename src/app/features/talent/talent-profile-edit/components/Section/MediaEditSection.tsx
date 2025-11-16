import { Separator } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import type { Media } from '../../types/talentProfile.types';
import { MediaPhotosForm, MediaVideosForm } from '../Form';

const MediaEditSection = ({ media, supabaseId }: { media: Media; supabaseId: string }) => {
  const { t } = useTranslation();

  return (
    <article className="lg:flex lg:flex-col lg:gap-6 bg-[var(--color-primary-white)] rounded-2xl border-[var(--color-secondary-outline)] border-1">
      <div className="flex flex-col gap-5 p-6">
        <MediaPhotosForm media={media} supabaseId={supabaseId}></MediaPhotosForm>
        <Separator className="opacity-20 my-8"></Separator>
        <MediaVideosForm data={media}></MediaVideosForm>
      </div>
    </article>
  );
};

export default MediaEditSection;
