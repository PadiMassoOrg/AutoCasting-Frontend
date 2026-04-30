import { SectionCard } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { DashboardSection } from '../../../../../layouts/components';
import { SectionTitle } from '../../../../../shared/components/Section';
import type { TalentProfileResponse } from '../../types/talentProfile.types';
import { CharacteristicsForm } from '../Form';

const TalentProfileDetailsEditSection = ({ profile }: { profile: TalentProfileResponse }) => {
  const { t } = useTranslation();
  return (
    <DashboardSection>
      <SectionTitle title={t('profile.pills.characteristics')} />
      <SectionCard>
        <CharacteristicsForm data={profile.characteristics}></CharacteristicsForm>
      </SectionCard>
    </DashboardSection>
  );
};

export default TalentProfileDetailsEditSection;
