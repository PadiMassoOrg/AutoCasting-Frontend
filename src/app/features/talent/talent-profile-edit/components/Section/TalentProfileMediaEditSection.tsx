import { DashboardSection, LG_SCREEN_SIZE, SectionCard, useMedia } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { SectionTitle } from '../../../../../shared/components/Section';
import type { Media } from '../../types/talentProfile.types';
import { MediaPhotosForm, MediaVideosForm } from '../Form';

const TalentProfileMediaEditSection = ({ media, supabaseId }: { media: Media; supabaseId: string }) => {
  const { t } = useTranslation();
  const isDesktop = useMedia(LG_SCREEN_SIZE);

  return (
    <DashboardSection>
      {!isDesktop && <SectionTitle title={t('profile.pills.media')} />}
      <SectionCard>
        <MediaPhotosForm media={media} supabaseId={supabaseId} />
        <MediaVideosForm data={media} />
      </SectionCard>
    </DashboardSection>
  );
};

export default TalentProfileMediaEditSection;
