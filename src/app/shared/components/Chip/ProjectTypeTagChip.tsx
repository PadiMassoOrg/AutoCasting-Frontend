import { TagChip } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import type { SiteMetadataObject } from '../../../features/sitemetadata/types/sitemetadata.types';
import { resolveProjectTypeColorVar } from '../../../features/sitemetadata/utils/siteMetadataUtils';

type ProjectTypeTagChipProps = {
  projectType?: SiteMetadataObject | null;
  className?: string;
};

export default function ProjectTypeTagChip({ projectType, className }: ProjectTypeTagChipProps) {
  const { t } = useTranslation();

  const code = projectType?.stringCode;
  if (!code) return null;

  const color = resolveProjectTypeColorVar(code);

  return <TagChip label={t(code)} className={className} style={color ? { borderColor: color, color } : undefined} />;
}
