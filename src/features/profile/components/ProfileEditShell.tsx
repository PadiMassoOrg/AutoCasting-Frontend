// src/features/profile/components/edit/ProfileEditShell.tsx
import { Separator } from 'autocasting-ui-library-padimasso';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMedia } from '../../../shared/hooks/useMedia';
import type { ProfileResponse } from '../types/profile.types';
import CarouselHeader from './Carousel/CarouselHeader/CarouselHeader';
import HorizontalCarousel from './Carousel/HorizontalCarousel/HorizontalCarousel';
import { DetailsEditSection, MediaEditSection, ProfileEditSection } from './section';

type OuterKey = 'profile' | 'media' | 'details';
const ORDER: OuterKey[] = ['profile', 'media', 'details'];

export default function ProfileEditShell({ profile }: { profile: ProfileResponse }) {
  const { t } = useTranslation();
  const isDesktop = useMedia('(min-width: 768px)'); // md breakpoint

  const [outer, setOuter] = useState<OuterKey>('profile');
  const outerIndex = ORDER.indexOf(outer);

  const items = useMemo(
    () => [
      { key: 'profile', label: t('profile.pills.profile') },
      { key: 'media', label: t('profile.pills.media') },
      { key: 'details', label: t('profile.pills.details') },
    ],
    [t]
  );

  return (
    <section className="w-full min-w-0">
      <CarouselHeader items={items} active={outerIndex} onChange={(i) => setOuter(ORDER[i])} />
      <Separator className="opacity-20 my-9" />

      {isDesktop ? (
        // Desktop: carrusel horizontal como siempre
        <HorizontalCarousel
          key={isDesktop ? 'desktop' : 'mobile'}
          active={outerIndex}
          onChange={(i) => setOuter(ORDER[i])}
        >
          <ProfileEditSection profile={profile} />
          <MediaEditSection media={profile.media} supabaseId={profile.id} />
          <DetailsEditSection profile={profile} />
        </HorizontalCarousel>
      ) : (
        // Mobile: SIN transform → un solo panel visible
        <div className="w-full min-w-0">
          {outer === 'profile' && <ProfileEditSection profile={profile} />}
          {outer === 'media' && <MediaEditSection media={profile.media} supabaseId={profile.id} />}
          {outer === 'details' && <DetailsEditSection profile={profile} />}
        </div>
      )}
    </section>
  );
}
