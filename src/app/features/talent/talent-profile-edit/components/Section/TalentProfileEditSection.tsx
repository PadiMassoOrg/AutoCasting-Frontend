import { Separator } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { useSiteMetadataSlice } from '../../../../sitemetadata/hooks/useSiteMetadataSlice';
import type { TalentProfileResponse } from '../../types/talentProfile.types';
import { BasicInfoForm, ContactForm, SocialMediaForm } from '../Form';

const TalentProfileEditSection = ({ profile }: { profile: TalentProfileResponse }) => {
  const { t } = useTranslation();
  const { data: professions = [] } = useSiteMetadataSlice('professions');

  return (
    <article className="lg:flex lg:flex-col lg:gap-6">
      <h3 className="hidden lg:block text-2xl font-bold">{t('profile.page.profile')}</h3>
      <BasicInfoForm data={profile.basicInfo} professionsMeta={professions}></BasicInfoForm>
      <Separator className="opacity-20 my-8" />
      <ContactForm data={profile.contact}></ContactForm>
      <Separator className="opacity-20 my-8" />
      <SocialMediaForm data={profile.socialMedia}></SocialMediaForm>
    </article>
  );
};

export default TalentProfileEditSection;
