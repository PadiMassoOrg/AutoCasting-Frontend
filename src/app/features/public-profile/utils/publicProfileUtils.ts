import type { TFunction } from 'i18next';
import type { SiteMetadataObject } from '../../sitemetadata/types/sitemetadata.types';

export function formatCharacteristicValue(key: string, raw: unknown, t: TFunction) {
  if (raw == null || raw.toString().length == 0) return '-';
  if (key === 'height') return `${raw} cm`;
  if (key === 'hairColor' || key === 'eyeColor' || key === 'diet') {
    const obj = raw as SiteMetadataObject;
    return t(obj.stringCode);
  }
  if (typeof raw === 'boolean') return raw ? t('general.yes') : t('general.no');
  return String(raw);
}
