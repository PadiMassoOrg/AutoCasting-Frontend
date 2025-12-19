import { Separator } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { DashboardSection } from '../../../../../layouts/components';
import { SectionCard, SectionTitle } from '../../../../../shared/components/Section';
import type { Media } from '../../types/talentProfile.types';
import { MediaPhotosForm, MediaVideosForm } from '../Form';

const TalentProfileMediaEditSection = ({ media, supabaseId }: { media: Media; supabaseId: string }) => {
  const { t } = useTranslation();
  return (
    <DashboardSection>
      <SectionTitle title={t('profile.pills.media')} />
      <SectionCard>
        <MediaPhotosForm media={media} supabaseId={supabaseId} />
        <Separator className="opacity-20 mb-12" />
        <MediaVideosForm data={media} />
      </SectionCard>
    </DashboardSection>
  );
};

export default TalentProfileMediaEditSection;
