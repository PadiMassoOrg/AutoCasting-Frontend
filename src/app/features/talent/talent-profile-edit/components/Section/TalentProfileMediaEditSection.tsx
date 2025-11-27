import { Separator } from 'autocasting-ui-library-padimasso';
import { ProfileEditSection } from '../../../../../shared/components/Section';
import type { Media } from '../../types/talentProfile.types';
import { MediaPhotosForm, MediaVideosForm } from '../Form';

const TalentProfileMediaEditSection = ({ media, supabaseId }: { media: Media; supabaseId: string }) => {
  return (
    <ProfileEditSection>
      <MediaPhotosForm media={media} supabaseId={supabaseId} />
      <Separator className="opacity-20 my-8" />
      <MediaVideosForm data={media} />
    </ProfileEditSection>
  );
};

export default TalentProfileMediaEditSection;
