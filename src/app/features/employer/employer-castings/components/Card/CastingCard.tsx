import { OverflowMenu, SectionCard, Separator, TagChip } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../../../../context/ModalContext';
import { ROUTES } from '../../../../../shared/lib/routes';
import { formatLocalDate } from '../../../../../shared/utils/formatUtils';
import StatusDropdown from '../../../../sitemetadata/component/StatusDropdown';
import { useCachedSiteMetadataOption } from '../../../../sitemetadata/hooks/useCachedSiteMetadata';
import {
  CASTING_DELETE_MODAL_CONFIG,
  CASTING_STATUS_ORDER,
  getCastingStatusChangeModalConfig,
} from '../../../../sitemetadata/utils/siteMetadataUtils';
import { useCastingStatusActions } from '../../hooks/status/useCastingStatusActions';
import { useCastingOverflowMenuItems } from '../../hooks/useCastingOverflowMenuItems';
import type { CastingCardResponse } from '../../types/employerCastings.types';
import { CastingActionConfirmationModal } from '../Modal/';

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
  const { openModal, closeModal } = useModal();

  const { id, title, defaultCode, creationDate, applicationDeadline, projectType, status, allowedStatusCodes } = data;

  const { setStatus, isPending: isStatusPending } = useCastingStatusActions();

  const publicCastingDetailsPath = `${ROUTES.PUBLIC_CASTING}/${defaultCode}`;
  const editCastingPath = `${ROUTES.EMPLOYER_CASTING}/${defaultCode}/editor`;
  const applicantsPath = `${ROUTES.EMPLOYER_CASTING}/${defaultCode}/applicants`;

  const openDeleteModal = () => {
    if (!onDelete) return;

    openModal(
      <CastingActionConfirmationModal
        descriptionKey={CASTING_DELETE_MODAL_CONFIG.descriptionKey}
        description2Key={CASTING_DELETE_MODAL_CONFIG.description2Key}
        confirmButtonKey={CASTING_DELETE_MODAL_CONFIG.confirmButtonKey}
        confirmButtonVariant={CASTING_DELETE_MODAL_CONFIG.confirmButtonVariant}
        onCancel={closeModal}
        onConfirm={async () => {
          await onDelete(id);
          closeModal();
        }}
      />,
      t(CASTING_DELETE_MODAL_CONFIG.titleKey),
      'lg'
    );
  };

  const items = useCastingOverflowMenuItems({
    detailsPath: publicCastingDetailsPath,
    publicCastingDetailsPath,
    editCastingPath,
    statusCode: status?.stringCode,
    onDelete: onDelete ? openDeleteModal : undefined,
    deleteDisabled,
    onApplicants: () => navigate(applicantsPath),
  });

  const castingStatusOptions = useCachedSiteMetadataOption('castingStatusOptions', t, undefined, { raw: true });
  const isMetadataReady = Array.isArray(castingStatusOptions) && castingStatusOptions.length > 0;

  const handleSelectStatus = (nextStatus: { id: string; stringCode: string; categoryStringCode?: string }) => {
    if (isStatusPending) return;

    const config = getCastingStatusChangeModalConfig(nextStatus);
    if (!config) return;

    openModal(
      <CastingActionConfirmationModal
        descriptionKey={config.descriptionKey}
        description2Key={config.description2Key}
        confirmButtonKey={config.confirmButtonKey}
        confirmButtonVariant={config.confirmButtonVariant}
        isPending={isStatusPending}
        onCancel={closeModal}
        onConfirm={async () => {
          await setStatus(nextStatus, { id, slug: defaultCode });
          closeModal();
        }}
      />,
      t(config.titleKey),
      'lg'
    );
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
          <p className="text-(--color-secondary-grey-fonts)">{t('employer_castings.casting_card.status.status')}:</p>

          {isMetadataReady ? (
            <StatusDropdown
              value={status}
              allowedCodes={allowedStatusCodes ?? []}
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
          <p className="text-(--color-secondary-grey-fonts)">{t('general.creation_date')}:</p>
          <span>{formatLocalDate(creationDate, 'dayMonth')}</span>
        </div>

        <div className="w-full flex flex-row items-center justify-between">
          <p className="text-(--color-secondary-grey-fonts)">{t('general.limit_date')}:</p>
          <span>{formatLocalDate(applicationDeadline, 'dayMonth')}</span>
        </div>

        <div className="w-full flex flex-row items-center justify-between">
          <p className="text-(--color-secondary-grey-fonts)">{t('casting.basic_info.project_type')}:</p>
          {projectType?.stringCode ? <TagChip label={t(projectType.stringCode)} /> : <span>-</span>}
        </div>
      </div>
    </SectionCard>
  );
};

export default CastingCard;
