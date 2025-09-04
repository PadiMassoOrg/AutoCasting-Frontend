import type { ProfileResponse } from '../../types/profile.types';
import DetailsInfoCarousel from '../Carousel/DetailsInfoCarousel/DetailsInfoCarousel';

const DetailsEditSection = ({ profile }: { profile: ProfileResponse }) => {
  // TODO - Verify
  if (!profile) return null;
  return (
    <div className="w-full min-w-0 max-w-none">
      <DetailsInfoCarousel profile={profile} />
    </div>
  );
};

export default DetailsEditSection;
