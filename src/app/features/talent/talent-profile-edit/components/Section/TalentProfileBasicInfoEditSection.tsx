import { Separator } from 'autocasting-ui-library-padimasso';
import { DashboardSection } from '../../../../../layouts/components';
import { useSiteMetadataSlice } from '../../../../sitemetadata/hooks/useSiteMetadataSlice';
import type { TalentProfileResponse } from '../../types/talentProfile.types';
import { BasicInfoForm, ContactForm } from '../Form';
import { SocialMediaForm } from '../Form/SocialMedia';

const TalentProfileBasicInfoEditSection = ({ profile }: { profile: TalentProfileResponse }) => {
  const { data: professions = [] } = useSiteMetadataSlice('professions');
  return (
    <DashboardSection>
      <BasicInfoForm data={profile.basicInfo} professionsMeta={professions} />
      <Separator className="opacity-20 my-8" />
      <ContactForm data={profile.contact} />
      <Separator className="opacity-20 my-8" />
      <SocialMediaForm data={profile.socialMedia} />
    </DashboardSection>
  );
};

export default TalentProfileBasicInfoEditSection;
