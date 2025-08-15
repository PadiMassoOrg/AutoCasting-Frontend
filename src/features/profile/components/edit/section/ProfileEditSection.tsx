import { Separator } from 'autocasting-ui-library-padimasso';
import { useSiteMetadataSlice } from '../../../../sitemetadata/hooks/useSiteMetadataSlice';
import type { ProfileResponse } from '../../../types/profile.types';
import { BasicInfoForm, ContactForm, SocialMediaForm } from '../form';

const ProfileEditSection = ({ profile }: { profile: ProfileResponse }) => {
  const { data: professions = [] } = useSiteMetadataSlice('professions');
  return (
    <>
      <BasicInfoForm data={profile.basicInfo} professionsMeta={professions}></BasicInfoForm>
      <Separator className="opacity-20 my-8" />
      <ContactForm data={profile.contact}></ContactForm>
      <Separator className="opacity-20 my-8" />
      <SocialMediaForm data={profile.socialMedia}></SocialMediaForm>
    </>
  );
};

export default ProfileEditSection;
