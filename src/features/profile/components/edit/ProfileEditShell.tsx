import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ProfileResponse } from '../../types/profile.types';
import Pills from '../../../../shared/components/A EXTRAER EN UI LIB/Pills/Pills';
import HorizontalCarousel from '../../../../shared/components/A EXTRAER EN UI LIB/HorizontalCarousel/HorizontalCarousel';
import { CharacteristicsForm, MediaForm } from '.';
import CarouselHeader from '../../../../shared/components/A EXTRAER EN UI LIB/CarouselHeader/CarouselHeader';
import Separator from '../../../../shared/components/A EXTRAER EN UI LIB/Separator/Separator';

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
      <Separator className="opacity-20 my-10" />
      <HorizontalCarousel active={outerIndex} onChange={(i) => setOuter(OUTER_ORDER[i])}>
        <div className="min-h-[60vh]">
          <h2>Profile</h2>
        </div>
        <div className="min-h-[60vh]">
          <MediaForm data={profile.media} />
        </div>
        <div className="min-h-[60vh]">
          <CharacteristicsForm data={profile.characteristics} />
        </div>
      </HorizontalCarousel>
    </section>
  );
}
