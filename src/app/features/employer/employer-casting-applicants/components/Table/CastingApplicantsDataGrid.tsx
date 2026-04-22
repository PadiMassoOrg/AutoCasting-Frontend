import { DataGrid, Icon, type DataGridColumn, type OverflowMenuItem } from 'autocasting-ui-library-padimasso';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../../../../shared/lib/routes';
import StatusDropdown from '../../../../sitemetadata/component/StatusDropdown';
import { useCachedSiteMetadataOption } from '../../../../sitemetadata/hooks/useCachedSiteMetadata';
import { CASTING_APPLICATION_STATUS_ORDER } from '../../../../sitemetadata/utils/siteMetadataUtils';
import { useCastingApplicationStatusActions } from '../../hooks/status/useCastingApplicationStatusActions';
import type { EmployerCastingApplicantCardResponse } from '../../types/employerCastingApplicants.types';

type Props = {
  data: EmployerCastingApplicantCardResponse[];
  page: number;
  hasNext: boolean;
  onPageChange: (nextPage: number) => void;
  onOpenDetails: (talentPublicSlug: string) => void | Promise<void>;
  enableBulkSelection?: boolean;
  selectedRowKeys?: string[];
  onSelectedRowKeysChange?: (next: string[]) => void;
};

const CastingApplicantsDataGrid = ({
  data,
  page,
  hasNext,
  onPageChange,
  onOpenDetails,
  enableBulkSelection = false,
  selectedRowKeys,
  onSelectedRowKeysChange,
}: Props) => {
  const { t } = useTranslation();
  const { setStatus, isPending } = useCastingApplicationStatusActions();

  const applicationStatusOptions = useCachedSiteMetadataOption('castingApplicationStatusOptions', t, undefined, {
    raw: true,
  });

  const isMetadataReady = Array.isArray(applicationStatusOptions) && applicationStatusOptions.length > 0;

  const columns = useMemo<DataGridColumn<EmployerCastingApplicantCardResponse>[]>(
    () => [
      {
        id: 'talent',
        header: t('general.applicant'),
        render: (row) => (
          <div className="flex w-full items-center gap-3 min-w-0">
            <img
              src={row.talentHeadshotImageUrl}
              alt={row.talentStageName}
              className="h-8 w-8 rounded-full object-cover shrink-0"
            />
            <button
              type="button"
              onClick={() => onOpenDetails(row.talentPublicSlug)}
              className="cursor-pointer font-semibold hover:underline hover:text-[var(--color-primary-purple)] block flex-1 min-w-0 truncate text-left"
              title={row.talentStageName}
            >
              {row.talentStageName}
            </button>
          </div>
        ),
      },
      {
        id: 'role',
        header: t('employer_castings.dashboard.roles.role.role'),
        cellContentClassName: 'font-semibold min-w-0',
        render: (row) => (
          <span className="block w-full truncate" title={row.castingRoleName}>
            {row.castingRoleName}
          </span>
        ),
      },
      {
        id: 'requirements',
        header: t('employer_castings.dashboard.requirements.requirements'),
        render: (row) => (
          <div className="flex flex-row items-center justify-between">
            {row.requirementSubmissions.length === 0 ? (
              <span className="rounded-full py-2 px-4 flex items-center gap-1">
                <p className="text-xs font-semibold text-(--color-primary-purple)">-</p>
              </span>
            ) : (
              row.requirementSubmissions.map((requirement) => (
                <div key={requirement.castingRequirementId} className="flex flex-row items-center gap-2 cursor-pointer">
                  {requirement.requiresAudio && (
                    <a
                      href={requirement.audioUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full py-2 px-4 flex items-center gap-1 bg-(--color-primary-light-grey)"
                    >
                      <Icon name="play" variant="primary" size={14} />
                      <p className="text-xs font-semibold text-(--color-primary-purple)">
                        {t('employer_casting_applicants.applicant_card.audio')}
                      </p>
                    </a>
                  )}

                  {requirement.requiresVideo && (
                    <a
                      href={requirement.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full py-2 px-4 flex items-center gap-1 bg-(--color-primary-light-grey)"
                    >
                      <Icon name="play" variant="primary" size={14} />
                      <p className="text-xs font-semibold text-(--color-primary-purple)">
                        {t('employer_casting_applicants.applicant_card.video')}
                      </p>
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        ),
      },
      {
        id: 'status',
        header: t('general.status'),
        width: 200,
        contentAlignment: 'right',
        render: (row) =>
          isMetadataReady ? (
            <StatusDropdown
              value={row.applicationStatus}
              allOptions={applicationStatusOptions}
              onSelect={(nextStatus) =>
                setStatus(nextStatus, { applicationId: row.applicationId, castingSlug: row.castingSlug })
              }
              order={CASTING_APPLICATION_STATUS_ORDER}
              disabled={isPending}
              menuClassName="!min-w-[200px]"
            />
          ) : (
            <div className="h-9 w-32 rounded-md bg-[rgba(0,0,0,0.06)] animate-pulse" />
          ),
      },
    ],
    [applicationStatusOptions, isMetadataReady, isPending, setStatus, t]
  );

  const actions = useMemo(
    () => ({
      header: t('general.actions'),
      items: (row: EmployerCastingApplicantCardResponse): OverflowMenuItem[] => [
        {
          key: `send-email-${row.applicationId}`,
          label: t('profile.basic_info.email'),
          iconName: 'mail',
          onSelect: () => {
            window.location.href = `mailto:${row.talentEmail}`;
          },
        },
        {
          key: `view-profile-${row.applicationId}`,
          label: t('profile.page.view_profile'),
          iconName: 'open',
          onSelect: () => {
            window.location.href = `${ROUTES.PUBLIC_PROFILE}/${row.talentPublicSlug}`;
          },
        },
      ],
    }),
    [t]
  );

  return (
    <DataGrid
      columns={columns}
      data={data}
      rowKey="applicationId"
      enableBulkSelection={enableBulkSelection}
      selection={
        selectedRowKeys && onSelectedRowKeysChange
          ? {
              selectedRowKeys,
              onSelectedRowKeysChange,
              headerAriaLabel: t('general.select_all'),
            }
          : undefined
      }
      actions={actions}
      emptyMessage={t('employer_casting_applicants.page.empty_page')}
      pagination={{
        page,
        hasNext,
        onPageChange,
        pageLabel: ({ page: currentPage }) => `Página ${currentPage + 1}`,
        previousLabel: 'Anterior',
        nextLabel: 'Siguiente',
      }}
    />
  );
};

export default CastingApplicantsDataGrid;
