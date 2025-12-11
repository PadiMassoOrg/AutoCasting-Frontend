import { Separator } from 'autocasting-ui-library-padimasso';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Chip } from '../../../../shared/components/Chip/Chip';
import type { Characteristics } from '../../../talent/talent-profile-edit/types/talentProfile.types';
import { formatCharacteristicValue } from '../../utils/publicProfileUtils';

export default function CharacteristicsPanel({ data }: { data: Characteristics }) {
  const { t } = useTranslation();

  const keys = [
    'height',
    'weight',
    'hairColor',
    'eyeColor',
    'chest',
    'waist',
    'hip',
    'shirt',
    'pants',
    'dress',
    'shoes',
    'tattoo',
    'passport',
    'drivingLicense',
    'diet',
  ] as const;

  const propMap: Record<(typeof keys)[number], keyof Characteristics | string> = {
    height: 'heightCm',
    weight: 'weightKg',
    hairColor: 'hairColor',
    eyeColor: 'eyeColor',
    chest: 'chestCm',
    waist: 'waistCm',
    hip: 'hipCm',
    shirt: 'shirtSize',
    pants: 'pantSize',
    dress: 'dressSize',
    shoes: 'shoeSize',
    tattoo: 'tattoo',
    passport: 'passport',
    drivingLicense: 'drivingLicense',
    diet: 'dietOption',
  };

  const dividerBefore = new Set(['hairColor', 'shirt']);

  return (
    <div className="flex flex-col gap-4 lg:gap-2">
      {keys.map((key) => {
        const label = t(`profile.characteristics.${key}`);
        const raw = (data as any)?.[propMap[key]];
        const value = formatCharacteristicValue(key, raw, t);
        return (
          <React.Fragment key={key}>
            {dividerBefore.has(key) && <Separator className="opacity-20 my-1" />}
            <div className="flex items-center justify-between">
              <span className="font-semibold text-base lg:text-[14px]">{label}:</span>
              <Chip label={value} t={t} />
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
