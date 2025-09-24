// src/features/profile/components/edit/ProfileEditShell.tsx
import { Separator } from 'autocasting-ui-library-padimasso';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LG_SCREEN_SIZE, useMedia } from '../../../shared/hooks/useMedia';
import type { ProfileResponse } from '../types/profile.types';
import CarouselHeader from './Carousel/CarouselHeader/CarouselHeader';
import HorizontalCarousel from './Carousel/HorizontalCarousel/HorizontalCarousel';
import { ProfileCompletionCard } from './ProfileCompletionCard/ProfileCompletionCard';
import { DetailsEditSection, MediaEditSection, ProfileEditSection } from './Section';

type OuterKey = 'profile' | 'media' | 'details';
const ORDER: OuterKey[] = ['profile', 'media', 'details'];

export default function ProfileEditShell({ profile }: { profile: ProfileResponse }) {
  const { t } = useTranslation();
  const isDesktop = useMedia(LG_SCREEN_SIZE);

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
    <section className="w-full h-full min-w-0 flex flex-col gap-6">
      <div className="flex items-center justify-center w-full lg:hidden py-3">
        <ProfileCompletionCard
          progress={profile.progress}
          isEdit
          publicSlug={profile.publicSlug}
        ></ProfileCompletionCard>
      </div>
      <div className="lg:flex lg:flex-row lg:gap-4 h-full min-h-0">
        <CarouselHeader items={items} active={outerIndex} onChange={(i) => setOuter(ORDER[i])} />
        <Separator className="opacity-20 my-9 lg:hidden" />
        {isDesktop ? (
          <article
            className="w-full h-full lg:pb-4 lg:py-6 lg:max-w-[650px] xl:max-w-[778px] lg:m-auto
                    min-h-0 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]
                    scrollbar-hide"
          >
            <section className={outer === 'profile' ? 'block' : 'hidden'} aria-hidden={outer !== 'profile'}>
              <ProfileEditSection profile={profile} />
            </section>
            <section className={outer === 'media' ? 'block' : 'hidden'} aria-hidden={outer !== 'media'}>
              <MediaEditSection media={profile.media} supabaseId={profile.id} />
            </section>
            <section className={outer === 'details' ? 'block' : 'hidden'} aria-hidden={outer !== 'details'}>
              <DetailsEditSection profile={profile} />
            </section>
          </article>
        ) : (
          <HorizontalCarousel
            key={isDesktop ? 'desktop' : 'mobile'}
            active={outerIndex}
            onChange={(i) => setOuter(ORDER[i])}
          >
            <ProfileEditSection profile={profile} />
            <MediaEditSection media={profile.media} supabaseId={profile.id} />
            <DetailsEditSection profile={profile} />
          </HorizontalCarousel>
        )}
      </div>
    </section>
  );
}
