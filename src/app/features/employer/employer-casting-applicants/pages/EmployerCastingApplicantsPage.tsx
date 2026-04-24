import { IconViewSwitcher, Label } from 'autocasting-ui-library-padimasso';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { DashboardSection, DashboardShell } from '../../../../layouts/components';
import { SectionTitle } from '../../../../shared/components/Section';
import { LG_SCREEN_SIZE, useMedia } from '../../../../shared/hooks/useMedia';
import { PublicProfileDetailsView } from '../../../public-profile/pages';
import { useSectionRoles } from '../../employer-castings/hooks/section/useSectionRoles';
import { useEmployerCastingEditorBySlug } from '../../employer-castings/hooks/useEmployerCastingDetailsBySlug';
import { CastingApplicantCard } from '../components/Card';
import CastingApplicantsFilterBar from '../components/Filter/CastingApplicantsFilterBar';
import CastingApplicantsGallery from '../components/Gallery/CastingApplicantsGallery';
import CastingApplicantsDataGrid from '../components/Table/CastingApplicantsDataGrid';
import { useEmployerCastingApplicants } from '../hooks/useEmployerCastingApplicants';
import { useEmployerCastingApplicantsInfinite } from '../hooks/useEmployerCastingApplicantsInfinite';
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
  const [selectedPublicSlug, setSelectedPublicSlug] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ApplicantsViewMode>('table');
  const [separateByRoles, setSeparateByRoles] = useState(false);

  const resolvedViewMode: ApplicantsViewMode = isDesktop ? viewMode : 'table';
  const isGalleryDesktop = isDesktop && resolvedViewMode === 'gallery';

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

  useEffect(() => {
    setPage(0);
  }, [slug, filters]);

  const { data: tableData } = useEmployerCastingApplicants(tableArgs, { enabled: !isGalleryDesktop });

  const {
    data: galleryData,
    fetchNextPage,
    hasNextPage: galleryHasNextPage,
    isFetchingNextPage: isGalleryFetchingNextPage,
    isLoading: isGalleryLoading,
  } = useEmployerCastingApplicantsInfinite(galleryArgs, { enabled: isGalleryDesktop });

  const applicants = useMemo(
    () =>
      isGalleryDesktop ? (galleryData?.pages ?? []).flatMap((slice) => slice.items ?? []) : (tableData?.items ?? []),
    [galleryData?.pages, isGalleryDesktop, tableData?.items]
  );
  const title = applicants.length > 0 ? `${applicants[0].castingTitle}` : '';

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

  const showGalleryEmpty = isGalleryDesktop && !isGalleryLoading && applicants.length === 0;

  return (
    <DashboardShell>
      <DashboardSection>
        <SectionTitle title={t('employer_casting_applicants.page.title') + ' ' + title} />

        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <CastingApplicantsFilterBar
              filters={filters}
              onFiltersChange={setFilters}
              roleOptions={roleOptions}
              isGalleryMode={resolvedViewMode === 'gallery'}
              separateByRoles={separateByRoles}
              onSeparateByRolesChange={setSeparateByRoles}
            />
          </div>
          {isDesktop && (
            <IconViewSwitcher
              items={['table', 'gallery']}
              defaultSelected={viewMode}
              onChange={(next) => setViewMode(next)}
            />
          )}
        </div>

        {(resolvedViewMode === 'gallery' ? showGalleryEmpty : applicants.length === 0) ? (
          <Label className="w-full text-center text-(--color-secondary-grey-fonts) pt-10">
            {t('employer_casting_applicants.page.empty_page')}
          </Label>
        ) : resolvedViewMode === 'gallery' ? (
          <>
            <CastingApplicantsGallery
              data={applicants}
              hasNext={galleryHasNextPage}
              isLoadingNext={isGalleryFetchingNextPage}
              onReachEnd={handleGalleryReachEnd}
            />
            {isGalleryFetchingNextPage && (
              <p className="py-8 text-center font-light text-(--color-secondary-grey)" aria-live="polite">
                {t('state.loading')}
              </p>
            )}
          </>
        ) : isDesktop ? (
          <div className="w-full flex flex-col gap-6">
            <CastingApplicantsDataGrid
              data={applicants}
              page={tableData?.page ?? page}
              hasNext={tableData?.hasNext ?? false}
              onPageChange={setPage}
              onOpenDetails={handleOpenDetails}
              enableBulkSelection
            />
          </div>
        ) : (
          <div className="w-full flex flex-col flex-wrap gap-6 md:flex-row">
            {applicants.map((i) => (
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
