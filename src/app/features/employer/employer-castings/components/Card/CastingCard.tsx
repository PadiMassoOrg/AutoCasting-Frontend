import { Separator } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Chip } from '../../../../../shared/components/Chip';
import { OverflowMenu } from '../../../../../shared/components/OverflowMenu';
import { SectionCard } from '../../../../../shared/components/Section';
import { ROUTES } from '../../../../../shared/lib/routes';
import { formatLocalDate } from '../../../../../shared/utils/formatUtils';
import StatusDropdown from '../../../../sitemetadata/component/StatusDropdown';
import { useCachedSiteMetadataOption } from '../../../../sitemetadata/hooks/useCachedSiteMetadata';
import { CASTING_STATUS_ORDER } from '../../../../sitemetadata/utils/siteMetadataUtils';
import { useCastingStatusActions } from '../../hooks/status/useCastingStatusActions';
import { useCastingOverflowMenuItems } from '../../hooks/useCastingOverflowMenuItems';
import type { CastingCardResponse } from '../../types/employerCastings.types';

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
  const navigate = useNavigate();

  const { id, title, defaultCode, creationDate, applicationDeadline, projectType, status, allowedStatusCodes } = data;

  const { setStatus, isPending: isStatusPending } = useCastingStatusActions();

  const publicCastingDetailsPath = `${ROUTES.PUBLIC_CASTING}/${defaultCode}`;
  const employerCastingDetailsPath = `${ROUTES.EMPLOYER_CASTING}/${defaultCode}/details`;
  const editCastingPath = `${ROUTES.EMPLOYER_CASTING}/${defaultCode}/editor`;
  const applicantsPath = `${ROUTES.EMPLOYER_CASTING}/${defaultCode}/applicants`;

  // IMPORTANT: We prefer disabled options (items exist but are disabled), so we pass statusCode to the hook.
  const items = useCastingOverflowMenuItems({
    employerCastingDetailsPath,
    publicCastingDetailsPath,
    editCastingPath,
    statusCode: status?.stringCode,
    onDelete: onDelete ? () => onDelete(id) : undefined,
    deleteDisabled,
    onApplicants: () => navigate(applicantsPath),
  });

  const castingStatusOptions = useCachedSiteMetadataOption('castingStatusOptions', t, undefined, { raw: true });
  const isMetadataReady = Array.isArray(castingStatusOptions) && castingStatusOptions.length > 0;

  const handleSelectStatus = async (nextStatus: { id: string; stringCode: string; categoryStringCode?: string }) => {
    if (isStatusPending) return;
    await setStatus(nextStatus, { id, slug: defaultCode });
  };

  return (
    <SectionCard className="lg:min-w-[415px]">
      <div className="flex flex-row items-center justify-between">
        <h2 className="font-bold">{title != null ? title : t('general.untitled')}</h2>
        <OverflowMenu items={items} align="end" side="bottom" />
      </div>

      <Separator className="opacity-20 my-3" />

      <div className="w-full flex flex-col items-center gap-2 text-sm">
        <div className="w-full flex flex-row items-center justify-between">
          <p className="text-[var(--color-secondary-grey-fonts)]">
            {t('employer_castings.casting_card.status.status')}:
          </p>

          {isMetadataReady ? (
            <StatusDropdown
              value={status}
              allowedCodes={allowedStatusCodes ?? []} // [] => none allowed (dropdown disabled by StatusDropdown semantics)
              allOptions={castingStatusOptions}
              order={CASTING_STATUS_ORDER}
              onSelect={handleSelectStatus}
              disabled={isStatusPending}
            />
          ) : (
            <div className="h-9 w-32 rounded-md bg-[rgba(0,0,0,0.06)] animate-pulse" />
          )}
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
          {projectType?.stringCode ? <Chip label={t(projectType.stringCode)} /> : <span>-</span>}
        </div>
      </div>
    </SectionCard>
  );
};

export default CastingCard;
