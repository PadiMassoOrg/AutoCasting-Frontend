import { Separator } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Chip } from '../../../../shared/components/Chip/Chip';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { SectionCard } from '../../../../shared/components/Section';
import { ROUTES } from '../../../../shared/lib/routes';
import { formatLocalDate } from '../../../../shared/utils/formatUtils';
import type { CastingCardResponse } from '../types/employerCastings.types';

const CastingCard = ({ data }: { data: CastingCardResponse }) => {
  const { t } = useTranslation();

  if (!data) return null;

  const { title, defaultCode, creationDate, applicationDeadline, projectType, status } = data;

  // TODO: Buttons, media queries
  // TODO: SIN TITULO
  return (
    <SectionCard>
      <div className="flex flex-row items-center justify-between">
        <h2>{title != null ? title : 'Sin Título'}</h2>
        <span>{t(status.stringCode)}</span>
      </div>
      <Separator className="opacity-20 my-3" />
      <div className="w-full flex flex-col items-center gap-2 text-sm">
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
          {projectType?.stringCode && <Chip label={t(projectType?.stringCode)} />}
        </div>
      </div>
      <Separator className="opacity-20 my-3" />
      <div className="flex flex-row items-center">
        <Link to={'/'} className="flex-1 flex items-center justify-center">
          <Icon name="profile" />
        </Link>
        <div className="h-10 w-px bg-[var(--color-secondary-outline)]" />
        <Link to={'/'} className="flex-1 flex items-center justify-center">
          <Icon name="copyLink" />
        </Link>
        <div className="h-10 w-px bg-[var(--color-secondary-outline)]" />
        <Link to={ROUTES.EMPLOYER_CASTING + '/' + defaultCode} className="flex-1 flex items-center justify-center">
          <Icon name="edit" />
        </Link>
      </div>
    </SectionCard>
  );
};

export default CastingCard;
