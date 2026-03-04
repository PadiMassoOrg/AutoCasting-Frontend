import { useTranslation } from 'react-i18next';
import type { SiteMetadataObject } from '../../../features/sitemetadata/types/sitemetadata.types';
import {
  resolveCastingApplicationStatusColorVar,
  resolveCastingStatusColorVar,
} from '../../../features/sitemetadata/utils/siteMetadataUtils';

type StatusChipVariant = 'bordered' | 'inline';
type StatusChipAlign = 'inline' | 'spaced';

type StatusChipProps = {
  status: SiteMetadataObject;
  variant?: StatusChipVariant;
  align?: StatusChipAlign;
  className?: string;
};

const APPLICATION_STATUS_PREFIX = 'sitemetadata.application_status.';

export default function StatusChip({ status, variant = 'bordered', align = 'inline', className }: StatusChipProps) {
  const { t } = useTranslation();

  const code = status?.stringCode;
  if (!code) return null;

  const colorVar = code.startsWith(APPLICATION_STATUS_PREFIX)
    ? resolveCastingApplicationStatusColorVar(code)
    : resolveCastingStatusColorVar(code);

  const baseClasses = 'inline-flex items-center gap-2';
  const borderedClasses =
    'rounded-xl border px-3 py-1 bg-[var(--color-primary-white)] border-[var(--color-secondary-outline)] text-[var(--color-primary-black)]';
  const inlineClasses = 'text-[var(--color-primary-black)]';
  const alignClasses = align === 'spaced' ? 'w-full justify-between' : '';

  return (
    <span
      className={[
        baseClasses,
        alignClasses,
        variant === 'bordered' ? borderedClasses : inlineClasses,
        className ?? '',
      ].join(' ')}
    >
      <span className="text-sm">{t(code)}</span>
      {colorVar ? (
        <span
          className="inline-block w-4 h-4 rounded-full shrink-0"
          style={{ background: colorVar }}
          aria-hidden="true"
        />
      ) : null}
    </span>
  );
}
