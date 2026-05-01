import { DashboardSection, LG_SCREEN_SIZE, SectionCard, useMedia } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { SectionTitle } from '../../../../../shared/components/Section';
import type { TalentProfileResponse } from '../../types/talentProfile.types';
import { CharacteristicsForm } from '../Form';

const TalentProfileDetailsEditSection = ({ profile }: { profile: TalentProfileResponse }) => {
  const { t } = useTranslation();
  const isDesktop = useMedia(LG_SCREEN_SIZE);

  return (
    <DashboardSection>
      {!isDesktop && <SectionTitle title={t('profile.pills.characteristics')} />}
      <SectionCard>
        <CharacteristicsForm data={profile.characteristics}></CharacteristicsForm>
      </SectionCard>
    </DashboardSection>
  );
};

export default TalentProfileDetailsEditSection;
