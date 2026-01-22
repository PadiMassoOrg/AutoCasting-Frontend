import { Separator } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { Chip } from '../../../../shared/components/Chip/Chip';
import OverflowMenu from '../../../../shared/components/OverflowMenu/OverflowMenu';
import { SectionCard } from '../../../../shared/components/Section';
import { ROUTES } from '../../../../shared/lib/routes';
import { formatLocalDate } from '../../../../shared/utils/formatUtils';
import { isCastingStatusPublished } from '../../../../shared/utils/siteMetadatUtils';
import { useCastingOverflowMenuItems } from '../hooks/useCastingOverflowMenuItems';
import type { CastingCardResponse } from '../types/employerCastings.types';

const CastingCard = ({
  data,
  onDelete,
  deleteDisabled = false,
}: {
  data: CastingCardResponse;
  onDelete?: (id: string) => void | Promise<void>;
  deleteDisabled?: boolean;
}) => {
  const { t } = useTranslation();
  if (!data) return null;
  const { id, title, defaultCode, creationDate, applicationDeadline, projectType, status } = data;
  const published = isCastingStatusPublished(status);
  const publicCastingPath = `${ROUTES.PUBLIC_CASTING}/${defaultCode}`;
  const editCastingPath = `${ROUTES.EMPLOYER_CASTING}/${defaultCode}`;

  const items = useCastingOverflowMenuItems({
    publicCastingPath,
    editCastingPath,
    disablePublicActions: !published,
    onDelete: onDelete ? () => onDelete(id) : undefined,
    deleteDisabled,
  });

  return (
    <SectionCard>
      <div className="flex flex-row items-center justify-between">
        <h2>{title != null ? title : t('general.untitled')}</h2>
        <OverflowMenu items={items} align="end" side="bottom" />
      </div>

      <Separator className="opacity-20 my-3" />

      <div className="w-full flex flex-col items-center gap-2 text-sm">
        <div className="w-full flex flex-row items-center justify-between">
          <p className="text-[var(--color-secondary-grey-fonts)]">
            {t('employer_castings.casting_card.status.status')}:
          </p>
          <span>{t(status.stringCode)}</span>
        </div>

        <div className="w-full flex flex-row items-center justify-between">
          <p className="text-[var(--color-secondary-grey-fonts)]">{t('general.creation_date')}:</p>
          <span>{formatLocalDate(creationDate, 'dayMonth')}</span>
        </div>

        <div className="w-full flex flex-row items-center justify-between">
          <p className="text-[var(--color-secondary-grey-fonts)]">{t('general.limit_date')}:</p>
          <span>{formatLocalDate(applicationDeadline, 'dayMonth')}</span>
        </div>

        <div className="w-full flex flex-row items-center justify-between">
          <p className="text-[var(--color-secondary-grey-fonts)]">{t('casting.basic_info.project_type')}:</p>
          {projectType?.stringCode && <Chip label={t(projectType.stringCode)} />}
        </div>
      </div>
    </SectionCard>
  );
};

export default CastingCard;
