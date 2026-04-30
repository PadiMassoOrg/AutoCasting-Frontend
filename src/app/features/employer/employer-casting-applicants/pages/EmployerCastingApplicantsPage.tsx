import { IconViewSwitcher, Label, Skeleton } from 'autocasting-ui-library-padimasso';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { DashboardSection, DashboardShell } from 'autocasting-ui-library-padimasso';
import { SectionTitle } from '../../../../shared/components/Section';
import { LG_SCREEN_SIZE, useMedia } from 'autocasting-ui-library-padimasso';
import { PublicProfileDetailsView } from '../../../public-profile/pages';
import { useSectionRoles } from '../../employer-castings/hooks/section/useSectionRoles';
import { useEmployerCastingEditorBySlug } from '../../employer-castings/hooks/useEmployerCastingDetailsBySlug';
import { CastingApplicantCard } from '../components/Card';
import CastingApplicantsBulkActionsBar from '../components/Filter/CastingApplicantsBulkActionsBar';
import CastingApplicantsFilterBar from '../components/Filter/CastingApplicantsFilterBar';
import CastingApplicantsGallery from '../components/Gallery/CastingApplicantsGallery';
import CastingApplicantsGalleryGrouped from '../components/Gallery/CastingApplicantsGalleryGrouped';
import CastingApplicantsDataGrid from '../components/Table/CastingApplicantsDataGrid';
import { useEmployerCastingApplicants } from '../hooks/useEmployerCastingApplicants';
import { useEmployerCastingApplicantsInfinite } from '../hooks/useEmployerCastingApplicantsInfinite';
import { useEmployerCastingApplicantsGrouped } from '../hooks/useEmployerCastingApplicantsGrouped';
import { getEmployerApplicantsByCastingSlug } from '../services/employerCastingApplicantsService';
import { useCastingApplicationStatusActions } from '../hooks/status/useCastingApplicationStatusActions';
import type { SiteMetadataObject } from '../../../sitemetadata/types/sitemetadata.types';
import type { EmployerCastingApplicantsRoleSliceResponse } from '../types/employerCastingApplicants.types';
import type { EmployerCastingApplicantsFiltersState } from '../types/employerCastingApplicantsFilter.types';

type ApplicantsViewMode = 'table' | 'gallery';

const EmployerCastingApplicantsPage = () => {
  const { t } = useTranslation();
  const isDesktop = useMedia(LG_SCREEN_SIZE);
  const { slug } = useParams<{ slug: string }>();

  if (!slug) return null;

  const [filters, setFilters] = useState<EmployerCastingApplicantsFiltersState>({
    applicationStatusIdTokens: undefined,
    roleId: undefined,
    search: undefined,
  });
  const orderBy = 'CREATION_DATE_DESC' as const;
  const [page, setPage] = useState(0);
  const tablePageSize = 8;
  const galleryPageSize = 12;
  const groupedPerRoleSize = 5;
  const [selectedPublicSlug, setSelectedPublicSlug] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ApplicantsViewMode>('table');
  const [separateByRoles, setSeparateByRoles] = useState(false);
  const [groupedRolesState, setGroupedRolesState] = useState<EmployerCastingApplicantsRoleSliceResponse[]>([]);
  const [loadingRoleIds, setLoadingRoleIds] = useState<Record<string, boolean>>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const { bulkSetStatusByCode, isPending: isBulkStatusPending } = useCastingApplicationStatusActions();

  const resolvedViewMode: ApplicantsViewMode = isDesktop ? viewMode : 'table';
  const isGalleryDesktop = isDesktop && resolvedViewMode === 'gallery';
  const shouldUseGroupedGallery = isGalleryDesktop && separateByRoles && !filters.roleId;

  const tableArgs = useMemo(
    () => ({
      slug,
      page,
      size: tablePageSize,
      filters,
      orderBy,
    }),
    [slug, page, filters, orderBy]
  );

  const galleryArgs = useMemo(
    () => ({
      slug,
      size: galleryPageSize,
      filters,
      orderBy,
    }),
    [slug, filters, orderBy]
  );

  const groupedArgs = useMemo(
    () => ({
      slug,
      perRoleSize: groupedPerRoleSize,
      filters,
      orderBy,
    }),
    [slug, filters, orderBy]
  );

  useEffect(() => {
    setPage(0);
  }, [slug, filters]);

  const { data: tableData, isLoading: isTableLoading } = useEmployerCastingApplicants(tableArgs, {
    enabled: !isGalleryDesktop,
  });

  const {
    data: galleryData,
    fetchNextPage,
    hasNextPage: galleryHasNextPage,
    isFetchingNextPage: isGalleryFetchingNextPage,
    isLoading: isGalleryLoading,
  } = useEmployerCastingApplicantsInfinite(galleryArgs, { enabled: isGalleryDesktop });

  const { data: groupedData, isLoading: isGroupedLoading } = useEmployerCastingApplicantsGrouped(groupedArgs, {
    enabled: shouldUseGroupedGallery,
  });

  useEffect(() => {
    if (!shouldUseGroupedGallery) return;
    setGroupedRolesState(groupedData?.roles ?? []);
    setLoadingRoleIds({});
  }, [groupedData?.roles, shouldUseGroupedGallery]);

  const applicants = useMemo(
    () =>
      isGalleryDesktop ? (galleryData?.pages ?? []).flatMap((slice) => slice.items ?? []) : (tableData?.items ?? []),
    [galleryData?.pages, isGalleryDesktop, tableData?.items]
  );

  const groupedApplicantsCount = useMemo(
    () => groupedRolesState.reduce((acc, role) => acc + (role.items?.length ?? 0), 0),
    [groupedRolesState]
  );
  const totalApplicantsCount = tableData?.totalCount ?? applicants.length;
  const selectedApplicants = useMemo(
    () => applicants.filter((applicant) => selectedRowKeys.includes(applicant.applicationId)),
    [applicants, selectedRowKeys]
  );
  const selectedApplicantEmails = useMemo(
    () => selectedApplicants.map((applicant) => applicant.talentEmail),
    [selectedApplicants]
  );
  const isBulkSelectionActive = selectedRowKeys.length > 0;
  const title = applicants.length > 0 ? `${applicants[0].castingTitle}` : '';

  useEffect(() => {
    if (!isBulkSelectionActive) return;
    if (viewMode !== 'table') setViewMode('table');
  }, [isBulkSelectionActive, viewMode]);

  const { data: castingEditor } = useEmployerCastingEditorBySlug(slug);
  const rolesSectionId = castingEditor?.rolesSectionId ?? '';
  const { data: rolesSection } = useSectionRoles(rolesSectionId);

  const roleOptions = useMemo(
    () =>
      (rolesSection?.roles ?? [])
        .map((role) => ({ value: role.id, label: role.roleName }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [rolesSection?.roles]
  );

  const handleOpenDetails = useCallback((talentPublicSlug: string) => {
    setSelectedPublicSlug(talentPublicSlug);
    setDetailsOpen(true);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setDetailsOpen(false);
    setSelectedPublicSlug(null);
  }, []);

  const handleGalleryReachEnd = useCallback(() => {
    if (!galleryHasNextPage || isGalleryFetchingNextPage) return;
    void fetchNextPage();
  }, [fetchNextPage, galleryHasNextPage, isGalleryFetchingNextPage]);

  const showGalleryEmpty =
    isGalleryDesktop &&
    (shouldUseGroupedGallery
      ? !isGroupedLoading && groupedApplicantsCount === 0
      : !isGalleryLoading && applicants.length === 0);
  const showTableInitialSkeletons = !isGalleryDesktop && isTableLoading && applicants.length === 0;
  const showGalleryInitialSkeletons = isGalleryDesktop && !shouldUseGroupedGallery && isGalleryLoading;
  const showGroupedInitialSkeletons = isGalleryDesktop && shouldUseGroupedGallery && isGroupedLoading;

  const handleGroupedRoleReachEnd = useCallback(
    (roleId: string) => {
      if (!shouldUseGroupedGallery || !roleId) return;
      if (loadingRoleIds[roleId]) return;

      const role = groupedRolesState.find((r) => r.roleId === roleId);
      if (!role || !role.hasNext) return;

      setLoadingRoleIds((prev) => ({ ...prev, [roleId]: true }));

      void getEmployerApplicantsByCastingSlug({
        slug,
        page: role.page + 1,
        size: groupedPerRoleSize,
        filters: {
          ...filters,
          roleId,
        },
        orderBy,
      })
        .then((nextSlice) => {
          setGroupedRolesState((prev) =>
            prev.map((current) => {
              if (current.roleId !== roleId) return current;
              return {
                ...current,
                items: [...current.items, ...(nextSlice.items ?? [])],
                hasNext: nextSlice.hasNext,
                page: nextSlice.page,
                size: nextSlice.size,
              };
            })
          );
        })
        .finally(() => {
          setLoadingRoleIds((prev) => {
            const copy = { ...prev };
            delete copy[roleId];
            return copy;
          });
        });
    },
    [filters, groupedPerRoleSize, groupedRolesState, loadingRoleIds, orderBy, shouldUseGroupedGallery, slug]
  );

  const handleSelectedRowKeysChange = useCallback(
    (nextSelectedVisibleKeys: string[]) => {
      const visibleIdsSet = new Set(applicants.map((applicant) => applicant.applicationId));
      setSelectedRowKeys((previous) => {
        const withoutCurrentPage = previous.filter((id) => !visibleIdsSet.has(id));
        const nextVisibleUnique = Array.from(new Set(nextSelectedVisibleKeys));
        return [...withoutCurrentPage, ...nextVisibleUnique];
      });
    },
    [applicants]
  );

  const handleBulkStatusSelect = useCallback(
    async (nextStatus: SiteMetadataObject) => {
      if (!selectedRowKeys.length) return;
      await bulkSetStatusByCode(nextStatus.stringCode, { applicationIds: selectedRowKeys, castingSlug: slug });
      setSelectedRowKeys([]);
    },
    [bulkSetStatusByCode, selectedRowKeys, slug]
  );

  return (
    <DashboardShell>
      <DashboardSection>
        <SectionTitle title={t('employer_casting_applicants.page.title') + ' ' + title} />

        <div className="flex items-center gap-3 min-h-[56px]">
          <div className="flex-1 min-w-0">
            {isBulkSelectionActive ? (
              <CastingApplicantsBulkActionsBar
                selectedCount={selectedRowKeys.length}
                selectedEmails={selectedApplicantEmails}
                onBulkStatusSelect={handleBulkStatusSelect}
                onClearSelection={() => setSelectedRowKeys([])}
                isPending={isBulkStatusPending}
              />
            ) : (
              <CastingApplicantsFilterBar
                filters={filters}
                onFiltersChange={setFilters}
                roleOptions={roleOptions}
                isGalleryMode={resolvedViewMode === 'gallery'}
                separateByRoles={separateByRoles}
                onSeparateByRolesChange={setSeparateByRoles}
              />
            )}
          </div>
          {isDesktop && !isBulkSelectionActive && (
            <IconViewSwitcher
              items={['table', 'gallery']}
              defaultSelected={viewMode}
              onChange={(next) => setViewMode(next)}
            />
          )}
        </div>

        {(
          resolvedViewMode === 'gallery'
            ? showGalleryEmpty && !showGalleryInitialSkeletons && !showGroupedInitialSkeletons
            : applicants.length === 0 && !showTableInitialSkeletons
        ) ? (
          <Label className="w-full text-center text-(--color-secondary-grey-fonts) pt-10">
            {t('employer_casting_applicants.page.empty_page')}
          </Label>
        ) : resolvedViewMode === 'gallery' ? (
          shouldUseGroupedGallery ? (
            showGroupedInitialSkeletons ? (
              <div className="w-full flex flex-col gap-6" aria-live="polite">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={`grouped-gallery-skeleton-${i}`} className="w-full">
                    <Skeleton className="h-8 w-48 mb-3 rounded-md" />
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                      {Array.from({ length: 3 }).map((__, j) => (
                        <Skeleton
                          key={`grouped-gallery-card-skeleton-${i}-${j}`}
                          className="h-[450px] w-full rounded-xl"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <CastingApplicantsGalleryGrouped
                roles={groupedRolesState}
                onReachRoleEnd={handleGroupedRoleReachEnd}
                loadingRoleIds={loadingRoleIds}
              />
            )
          ) : (
            <>
              {showGalleryInitialSkeletons ? (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3" aria-live="polite">
                  {Array.from({ length: galleryPageSize }).map((_, i) => (
                    <Skeleton key={`gallery-skeleton-${i}`} className="h-[450px] w-full rounded-xl" />
                  ))}
                </div>
              ) : (
                <CastingApplicantsGallery
                  data={applicants}
                  hasNext={galleryHasNextPage}
                  isLoadingNext={isGalleryFetchingNextPage}
                  onReachEnd={handleGalleryReachEnd}
                />
              )}
              {isGalleryFetchingNextPage && (
                <p className="py-8 text-center font-light text-(--color-secondary-grey)" aria-live="polite">
                  {t('state.loading')}
                </p>
              )}
            </>
          )
        ) : isDesktop ? (
          <div className="w-full flex flex-col gap-6">
            {showTableInitialSkeletons ? (
              <div className="w-full flex flex-col gap-3" aria-live="polite">
                <Skeleton className="h-12 w-full rounded-lg" />
                {Array.from({ length: tablePageSize }).map((_, i) => (
                  <Skeleton key={`applicants-table-row-skeleton-${i}`} className="h-14 w-full rounded-lg" />
                ))}
              </div>
            ) : (
              <CastingApplicantsDataGrid
                data={applicants}
                page={tableData?.page ?? page}
                hasNext={tableData?.hasNext ?? false}
                onPageChange={setPage}
                onOpenDetails={handleOpenDetails}
                enableBulkSelection
                selectedRowKeys={selectedRowKeys.filter((id) =>
                  applicants.some((applicant) => applicant.applicationId === id)
                )}
                onSelectedRowKeysChange={handleSelectedRowKeysChange}
                totalCount={totalApplicantsCount}
              />
            )}
          </div>
        ) : (
          <div className="w-full flex flex-col flex-wrap gap-6 md:flex-row">
            {showTableInitialSkeletons
              ? Array.from({ length: tablePageSize }).map((_, i) => (
                  <div key={`applicant-card-skeleton-${i}`} className="w-full md:w-[415px]">
                    <Skeleton className="h-[320px] w-full rounded-xl" />
                  </div>
                ))
              : applicants.map((i) => (
                  <CastingApplicantCard
                    key={i.applicationId}
                    data={i}
                    isDesktop={isDesktop}
                    onOpenDetails={handleOpenDetails}
                  />
                ))}
          </div>
        )}
      </DashboardSection>

      {isDesktop && (
        <PublicProfileDetailsView open={detailsOpen} onClose={handleCloseDetails} publicSlug={selectedPublicSlug} />
      )}
    </DashboardShell>
  );
};

export default EmployerCastingApplicantsPage;
