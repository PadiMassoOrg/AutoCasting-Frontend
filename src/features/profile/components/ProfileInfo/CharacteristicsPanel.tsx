import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Characteristics, SiteMetadataObject } from '../../types/profile.types';
import Separator from '../../../../shared/components/Separator/Separator';

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
    'pant',
    'dress',
    'shoe',
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
    pant: 'pantSize',
    dress: 'dressSize',
    shoe: 'shoeSize',
    tattoo: 'tattoo',
    passport: 'passport',
    drivingLicense: 'drivingLicense',
    diet: 'dietOption',
  };

  // Para agregar líneas divisorias como en la captura
  const dividerBefore = new Set(['hairColor', 'shirt']);

  return (
    <div className="flex flex-col gap-4">
      {keys.map((key) => {
        const label = t(`profile.characteristics.${key}`);
        const raw = (data as any)?.[propMap[key]];
        const value = formatValue(key, raw, t);
        return (
          <React.Fragment key={key}>
            {dividerBefore.has(key) && <Separator className="opacity-20 my-1" />}
            <div className="flex items-center justify-between">
              <span className="font-semibold text-lg">{label}:</span>
              <span className="inline-flex items-center rounded-xl border border-[var(--color-secondary-outline)] px-3 py-1 text-base">
                {value}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

function formatValue(key: string, raw: unknown, t: ReturnType<typeof useTranslation>['t']): React.ReactNode {
  if (raw == null) return '-';
  if (key === 'height') return `${raw} cm`;
  if (key === 'weight') return `${raw} kg`;
  if (key === 'hairColor' || key === 'eyeColor' || key === 'diet') {
    const obj = raw as SiteMetadataObject;
    return t(obj.stringCode);
  }
  if (typeof raw === 'boolean') return raw ? t('general.yes') : t('general.no');
  return String(raw);
}
