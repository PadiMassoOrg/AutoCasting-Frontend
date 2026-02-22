import { useTranslation } from 'react-i18next';
import type { SiteMetadataObject } from '../../../features/sitemetadata/types/sitemetadata.types';
import { resolveCastingStatusColorVar } from '../../../features/sitemetadata/utils/siteMetadataUtils';

type StatusChipVariant = 'bordered' | 'inline';

type StatusChipProps = {
  status: SiteMetadataObject;
  variant?: StatusChipVariant;
  className?: string;
};

export default function StatusChip({ status, variant = 'bordered', className }: StatusChipProps) {
  const { t } = useTranslation();
  const code = status?.stringCode;

  if (!code) return null;

  const colorVar = resolveCastingStatusColorVar(code);
  if (!colorVar) return null;

  const baseClasses = 'inline-flex items-center gap-2';
  const borderedClasses =
    'rounded-xl border px-3 py-1 bg-[var(--color-primary-white)] border-[var(--color-secondary-outline)] text-[var(--color-primary-black)]';
  const inlineClasses = 'text-[var(--color-primary-black)]';

  return (
    <span
      className={[baseClasses, variant === 'bordered' ? borderedClasses : inlineClasses, className ?? ''].join(' ')}
    >
      <span className="text-sm">{t(code)}</span>
      <span className="inline-block w-4 h-4 rounded-full" style={{ background: colorVar }} aria-hidden="true" />
    </span>
  );
}
