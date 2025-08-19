import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ProfileResponse } from '../../types/profile.types';
import { ProfileEditSection, MediaEditSection, DetailsEditSection } from './section';
import { Separator } from 'autocasting-ui-library-padimasso';
import CarouselHeader from './CarouselHeader/CarouselHeader';
import HorizontalCarousel from './HorizontalCarousel/HorizontalCarousel';

type OuterKey = 'profile' | 'media' | 'details';

export default function ProfileEditShell({ profile }: { profile: ProfileResponse }) {
  const { t } = useTranslation();

  // ------------ OUTER ------------
  const [outer, setOuter] = useState<OuterKey>('profile');
  const OUTER_ORDER: OuterKey[] = ['profile', 'media', 'details'];
  const outerIndex = OUTER_ORDER.indexOf(outer);

  const outerItems = useMemo(
    () => [
      { key: 'profile', label: t('profile.pills.profile') },
      { key: 'media', label: t('profile.pills.media') },
      { key: 'details', label: t('profile.pills.details') },
    ],
    [t]
  );

  return (
    <section className="w-full">
      <CarouselHeader items={outerItems} active={outerIndex} onChange={(i) => setOuter(OUTER_ORDER[i])} />
      <Separator className="opacity-20 my-9" />
      <HorizontalCarousel active={outerIndex} onChange={(i) => setOuter(OUTER_ORDER[i])}>
        <ProfileEditSection profile={profile}></ProfileEditSection>
        <MediaEditSection media={profile.media} supabaseId={profile.id} />
        <DetailsEditSection profile={profile} />
      </HorizontalCarousel>
      <Separator className="opacity-20 mt-9" />
    </section>
  );
}
