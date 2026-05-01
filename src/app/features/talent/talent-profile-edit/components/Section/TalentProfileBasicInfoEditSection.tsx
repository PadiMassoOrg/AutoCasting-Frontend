import { DashboardSection, LG_SCREEN_SIZE, SectionCard, Separator, useMedia } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { SectionTitle } from '../../../../../shared/components/Section';
import { useSiteMetadataSlice } from '../../../../sitemetadata/hooks/useSiteMetadataSlice';
import { useSocialMediaAutosave } from '../../hooks/autosaves';
import type { TalentProfileResponse } from '../../types/talentProfile.types';
import { BasicInfoForm, ContactForm } from '../Form';
import { SocialMediaForm } from '../Form/SocialMedia';

const TalentProfileBasicInfoEditSection = ({ profile }: { profile: TalentProfileResponse }) => {
  const { t } = useTranslation();
  const { data: professions = [] } = useSiteMetadataSlice('professions');
  const socialMediaAutosave = useSocialMediaAutosave();
  const isDesktop = useMedia(LG_SCREEN_SIZE);

  return (
    <DashboardSection>
      {!isDesktop && <SectionTitle title={t('profile.pills.basic_info')} />}
      <SectionCard>
        <BasicInfoForm data={profile.basicInfo} professionsMeta={professions} />
        <Separator className="opacity-20 my-8" />
        <ContactForm data={profile.contact} />
        <Separator className="opacity-20 mb-8 mt-4" />
        <SocialMediaForm data={profile.socialMedia} onSaveLinks={(payload) => socialMediaAutosave.immediate(payload)} />
      </SectionCard>
    </DashboardSection>
  );
};

export default TalentProfileBasicInfoEditSection;
