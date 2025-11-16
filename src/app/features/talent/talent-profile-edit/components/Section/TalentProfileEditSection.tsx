import { Separator } from 'autocasting-ui-library-padimasso';
import { useSiteMetadataSlice } from '../../../../sitemetadata/hooks/useSiteMetadataSlice';
import type { TalentProfileResponse } from '../../types/talentProfile.types';
import { BasicInfoForm, ContactForm, SocialMediaForm } from '../Form';

const TalentProfileEditSection = ({ profile }: { profile: TalentProfileResponse }) => {
  const { data: professions = [] } = useSiteMetadataSlice('professions');

  return (
    <article className="lg:flex lg:flex-col lg:gap-6 bg-[var(--color-primary-white)] rounded-2xl border-[var(--color-secondary-outline)] border-1">
      <div className="p-6">
        <BasicInfoForm data={profile.basicInfo} professionsMeta={professions}></BasicInfoForm>
        <Separator className="opacity-20 my-8" />
        <ContactForm data={profile.contact}></ContactForm>
        <Separator className="opacity-20 my-8" />
        <SocialMediaForm data={profile.socialMedia}></SocialMediaForm>
      </div>
    </article>
  );
};

export default TalentProfileEditSection;
