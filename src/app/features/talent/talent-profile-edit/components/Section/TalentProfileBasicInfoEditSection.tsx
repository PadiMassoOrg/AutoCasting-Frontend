import { Separator } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { DashboardSection } from '../../../../../layouts/components';
import { SectionCard, SectionTitle } from '../../../../../shared/components/Section';
import { useSiteMetadataSlice } from '../../../../sitemetadata/hooks/useSiteMetadataSlice';
import { useSocialMediaAutosave } from '../../hooks/autosaves';
import type { TalentProfileResponse } from '../../types/talentProfile.types';
import { BasicInfoForm, ContactForm } from '../Form';
import { SocialMediaForm } from '../Form/SocialMedia';

const TalentProfileBasicInfoEditSection = ({ profile }: { profile: TalentProfileResponse }) => {
  const { t } = useTranslation();
  const { data: professions = [] } = useSiteMetadataSlice('professions');
  const socialMediaAutosave = useSocialMediaAutosave();

  return (
    <DashboardSection>
      <SectionTitle title={t('profile.pills.basic_info')} />
      <SectionCard>
        <BasicInfoForm data={profile.basicInfo} professionsMeta={professions} />
        <Separator className="opacity-20 my-8" />
        <ContactForm data={profile.contact} />
        <Separator className="opacity-20 my-8" />
        <SocialMediaForm data={profile.socialMedia} onSaveLinks={(payload) => socialMediaAutosave.immediate(payload)} />
      </SectionCard>
    </DashboardSection>
  );
};

export default TalentProfileBasicInfoEditSection;
