import { Separator } from 'autocasting-ui-library-padimasso';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Chip } from '../../../../shared/components/Chip/Chip';
import OverflowMenu from '../../../../shared/components/OverflowMenu/OverflowMenu';
import type { OverflowMenuItem } from '../../../../shared/components/OverflowMenu/overflowmenu.types';
import { SectionCard } from '../../../../shared/components/Section';
import { ROUTES } from '../../../../shared/lib/routes';
import { copyToClipboardGraceful } from '../../../../shared/utils/domUtils';
import { formatLocalDate } from '../../../../shared/utils/formatUtils';
import { isCastingStatusPublished } from '../../../../shared/utils/siteMetadatUtils';
import type { CastingCardResponse } from '../types/employerCastings.types';

const CastingCard = ({
  data,
  onDelete,
}: {
  data: CastingCardResponse;
  onDelete?: (id: string) => void | Promise<void>;
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!data) return null;

  const { id, title, defaultCode, creationDate, applicationDeadline, projectType, status } = data;

  const published = isCastingStatusPublished(status);

  const publicCastingPath = `${ROUTES.PUBLIC_CASTING}/${defaultCode}`;
  const editCastingPath = `${ROUTES.EMPLOYER_CASTING}/${defaultCode}`;

  const items: OverflowMenuItem[] = useMemo(
    () => [
      {
        key: 'details',
        label: t('employer_castings.actions.view_details'),
        disabled: !published,
        onSelect: () => navigate(publicCastingPath),
      },
      {
        key: 'applicants',
        label: t('employer_castings.actions.view_applicants'),
        disabled: !published,
        onSelect: () => console.log('view_applicants'),
      },
      {
        key: 'copy_link',
        label: t('employer_castings.actions.copy_link'),
        disabled: !published,
        onSelect: () => {
          const url = new URL(publicCastingPath, window.location.origin).toString();
          void copyToClipboardGraceful(url);
        },
      },
      {
        key: 'edit',
        label: t('general.edit'),
        onSelect: () => navigate(editCastingPath),
      },
      { type: 'separator', key: 'sep-1' },
      {
        key: 'delete',
        label: t('general.delete'),
        destructive: true,
        onSelect: () => {
          if (onDelete) return onDelete(id as any);
        },
      },
    ],
    [t, published, navigate, publicCastingPath, editCastingPath, onDelete, id]
  );

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
