import { Separator } from 'autocasting-ui-library-padimasso';
import SectionCard from '../../../../../shared/components/SectionCard/SectionCard';
import type { Media } from '../../types/talentProfile.types';
import { MediaPhotosForm, MediaVideosForm } from '../Form';

const TalentProfileMediaEditSection = ({ media, supabaseId }: { media: Media; supabaseId: string }) => {
  return (
    <SectionCard>
      <MediaPhotosForm media={media} supabaseId={supabaseId} />
      <Separator className="opacity-20 mb-12" />
      <MediaVideosForm data={media} />
    </SectionCard>
  );
};

export default TalentProfileMediaEditSection;
