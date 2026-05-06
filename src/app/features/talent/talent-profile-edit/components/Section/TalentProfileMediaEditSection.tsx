import type { Media } from '../../types/talentProfile.types';
import { MediaPhotosForm, MediaVideosForm } from '../Form';

const TalentProfileMediaEditSection = ({ media, supabaseId }: { media: Media; supabaseId: string }) => {
  return (
    <>
      <MediaPhotosForm media={media} supabaseId={supabaseId} />
      <MediaVideosForm data={media} />
    </>
  );
};

export default TalentProfileMediaEditSection;
