import { Separator } from 'autocasting-ui-library-padimasso';
import { DashboardSection } from '../../../../../layouts/components';
import type { Media } from '../../types/talentProfile.types';
import { MediaPhotosForm, MediaVideosForm } from '../Form';

const TalentProfileMediaEditSection = ({ media, supabaseId }: { media: Media; supabaseId: string }) => {
  return (
    <DashboardSection>
      <MediaPhotosForm media={media} supabaseId={supabaseId} />
      <Separator className="opacity-20 my-8" />
      <MediaVideosForm data={media} />
    </DashboardSection>
  );
};

export default TalentProfileMediaEditSection;
