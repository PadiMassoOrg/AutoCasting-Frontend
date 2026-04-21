import { DataGrid, type DataGridColumn, type OverflowMenuItem } from 'autocasting-ui-library-padimasso';
import { useCallback, useMemo } from 'react';
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
  isDesktop: boolean;
  onOpenDetails: (talentPublicSlug: string) => void | Promise<void>;
  selectedRowKeys: string[];
  onSelectedRowKeysChange: (next: string[]) => void;
};

const CastingApplicantsDataGrid = ({
  data,
  page,
  hasNext,
  onPageChange,
  isDesktop,
  onOpenDetails,
  selectedRowKeys,
  onSelectedRowKeysChange,
}: Props) => {
  const { t } = useTranslation();
  const { setStatus, isPending } = useCastingApplicationStatusActions();

  const applicationStatusOptions = useCachedSiteMetadataOption('castingApplicationStatusOptions', t, undefined, {
    raw: true,
  });

  const isMetadataReady = Array.isArray(applicationStatusOptions) && applicationStatusOptions.length > 0;

  const handleOpenDetails = useCallback(
    (talentPublicSlug: string) => {
      if (isDesktop) {
        onOpenDetails(talentPublicSlug);
        return;
      }

      window.location.href = `${ROUTES.PUBLIC_PROFILE}/${talentPublicSlug}`;
    },
    [isDesktop, onOpenDetails]
  );

  const columns = useMemo<DataGridColumn<EmployerCastingApplicantCardResponse>[]>(
    () => [
      {
        id: 'talent',
        header: t('general.tooltips.view_profile'),
        render: (row) => (
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={row.talentHeadshotImageUrl}
              alt={row.talentStageName}
              className="h-8 w-8 rounded-full object-cover shrink-0"
            />
            <button
              type="button"
              onClick={() => handleOpenDetails(row.talentPublicSlug)}
              className="text-left font-semibold hover:underline hover:text-[var(--color-primary-purple)]"
            >
              {row.talentStageName}
            </button>
          </div>
        ),
      },
      {
        id: 'role',
        header: t('casting.role_section.role.role'),
        accessor: 'castingRoleName',
        className: 'font-semibold',
      },
      {
        id: 'requirements',
        header: t('employer_castings.dashboard.requirements.requirements'),
        render: (row) => (
          <div className="flex items-center gap-2 flex-wrap">
            {row.requirementSubmissions.length === 0 ? (
              <span className="text-xs font-semibold text-[var(--color-secondary-grey-fonts)]">-</span>
            ) : (
              row.requirementSubmissions.map((requirement) => (
                <div key={requirement.castingRequirementId} className="flex items-center gap-2">
                  {requirement.requiresAudio && (
                    <a
                      href={requirement.audioUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full py-1 px-3 flex items-center gap-1 bg-(--color-primary-light-grey)"
                    >
                      <span className="text-xs font-semibold text-(--color-primary-purple)">
                        {t('employer_casting_applicants.applicant_card.audio')}
                      </span>
                    </a>
                  )}
                  {requirement.requiresVideo && (
                    <a
                      href={requirement.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full py-1 px-3 flex items-center gap-1 bg-(--color-primary-light-grey)"
                    >
                      <span className="text-xs font-semibold text-(--color-primary-purple)">
                        {t('employer_casting_applicants.applicant_card.video')}
                      </span>
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
        headerClassName: 'w-[250px]',
        headerJustify: 'start',
        justify: 'end',
      },
    ],
    [applicationStatusOptions, isMetadataReady, isPending, setStatus, t]
  );

  const actions = useMemo(
    () => ({
      header: t('employer_castings.actions.view_details'),
      widthClassName: 'w-[150px]',
      items: (row: EmployerCastingApplicantCardResponse): OverflowMenuItem[] => [
        {
          key: `send-email-${row.applicationId}`,
          label: t('profile.share.email'),
          iconName: 'mail',
          onSelect: () => {
            window.location.href = `mailto:${row.talentEmail}`;
          },
        },
        {
          key: `view-profile-${row.applicationId}`,
          label: t('general.tooltips.view_profile'),
          iconName: 'view',
          onSelect: () => handleOpenDetails(row.talentPublicSlug),
        },
      ],
    }),
    [handleOpenDetails, t]
  );

  return (
    <DataGrid
      columns={columns}
      data={data}
      rowKey="applicationId"
      selection={{
        selectedRowKeys,
        onSelectedRowKeysChange,
        headerAriaLabel: t('general.select_all'),
      }}
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
