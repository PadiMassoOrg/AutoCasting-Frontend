import { useSiteMetadataSlice } from '../../../../sitemetadata/hooks/useSiteMetadataSlice';
import type { ProfileResponse } from '../../../types/profile.types';
import { BasicInfoForm } from '../form';

const ProfileEditSection = ({ profile }: { profile: ProfileResponse }) => {
  const { data: professions = [] } = useSiteMetadataSlice('professions');
  return <BasicInfoForm data={profile.basicInfo} professionsMeta={professions}></BasicInfoForm>;
};

export default ProfileEditSection;
