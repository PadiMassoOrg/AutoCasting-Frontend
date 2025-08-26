import type { ProfileResponse } from '../../../types/profile.types';

const DetailsEditSection = ({ profile }: { profile: ProfileResponse }) => {
  if (!profile) return;
  return <h2>Details Section</h2>;
};

export default DetailsEditSection;
