import { TagChip } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import type { SiteMetadataObject } from '../../../features/sitemetadata/types/sitemetadata.types';

type CastingModalityTagChipProps = {
  castingModality?: SiteMetadataObject | null;
  className?: string;
};

export default function CastingModalityTagChip({ castingModality, className }: CastingModalityTagChipProps) {
  const { t } = useTranslation();

  const code = castingModality?.stringCode;
  if (!code) return null;

  return (
    <TagChip
      label={t(code)}
      className={className}
      style={{ borderColor: 'var(--color-primary-purple)', color: 'var(--color-primary-purple)' }}
    />
  );
}
