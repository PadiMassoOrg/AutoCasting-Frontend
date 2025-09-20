import { useTranslation } from 'react-i18next';
import type { ProfileResponse } from '../../types/profile.types';
import DetailsInfoCarousel from '../Carousel/DetailsInfoCarousel/DetailsInfoCarousel';

const DetailsEditSection = ({ profile }: { profile: ProfileResponse }) => {
  const { t } = useTranslation();

  return (
    <article className="lg:flex lg:flex-col lg:gap-6">
      <h3 className="hidden lg:block text-2xl font-bold">{t('profile.pills.media')}</h3>
      <div className="w-full min-w-0 max-w-none lg:min-h-screen">
        <DetailsInfoCarousel profile={profile} />
      </div>
    </article>
  );
};

export default DetailsEditSection;
