import { Separator } from 'autocasting-ui-library-padimasso';
import { ProfileEditSection } from '../../../../../shared/components/Section';
import { useSiteMetadataSlice } from '../../../../sitemetadata/hooks/useSiteMetadataSlice';
import type { TalentProfileResponse } from '../../types/talentProfile.types';
import { BasicInfoForm, ContactForm, SocialMediaForm } from '../Form';

const TalentProfileBasicInfoEditSection = ({ profile }: { profile: TalentProfileResponse }) => {
  const { data: professions = [] } = useSiteMetadataSlice('professions');

  return (
    <ProfileEditSection>
      <BasicInfoForm data={profile.basicInfo} professionsMeta={professions} />
      <Separator className="opacity-20 my-8" />
      <ContactForm data={profile.contact} />
      <Separator className="opacity-20 my-8" />
      <SocialMediaForm data={profile.socialMedia} />
    </ProfileEditSection>
  );
};

export default TalentProfileBasicInfoEditSection;
