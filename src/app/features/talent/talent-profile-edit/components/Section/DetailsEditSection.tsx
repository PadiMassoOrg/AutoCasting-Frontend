import type { TalentProfileResponse } from '../../types/talentProfile.types';
import DetailsInfoCarousel from '../Carousel/DetailsInfoCarousel/DetailsInfoCarousel';

const DetailsEditSection = ({ profile }: { profile: TalentProfileResponse }) => {
  return (
    <article className="lg:flex lg:flex-col lg:gap-6">
      <div className="w-full min-w-0 max-w-none lg:min-h-screen">
        <DetailsInfoCarousel profile={profile} />
      </div>
    </article>
  );
};

export default DetailsEditSection;
