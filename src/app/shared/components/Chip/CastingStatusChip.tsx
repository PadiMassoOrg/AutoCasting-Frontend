import { StatusChip } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import type { SiteMetadataObject } from '../../../features/sitemetadata/types/sitemetadata.types';
import {
  resolveCastingApplicationStatusColorVar,
  resolveCastingStatusColorVar,
} from '../../../features/sitemetadata/utils/siteMetadataUtils';

type StatusChipVariant = 'bordered' | 'inline';
type StatusChipAlign = 'inline' | 'spaced';

type CastingStatusChipProps = {
  status: SiteMetadataObject;
  variant?: StatusChipVariant;
  align?: StatusChipAlign;
  className?: string;
};

const APPLICATION_STATUS_PREFIX = 'sitemetadata.application_status.';

export default function CastingStatusChip({
  status,
  variant = 'bordered',
  align = 'inline',
  className,
}: CastingStatusChipProps) {
  const { t } = useTranslation();

  const code = status?.stringCode;
  if (!code) return null;

  const dotColor = code.startsWith(APPLICATION_STATUS_PREFIX)
    ? resolveCastingApplicationStatusColorVar(code)
    : resolveCastingStatusColorVar(code);

  return <StatusChip label={t(code)} dotColor={dotColor} variant={variant} align={align} className={className} />;
}
