import { IconViewSwitcher, Label } from 'autocasting-ui-library-padimasso';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { DashboardSection, DashboardShell } from '../../../../layouts/components';
import { SectionTitle } from '../../../../shared/components/Section';
import { LG_SCREEN_SIZE, useMedia } from '../../../../shared/hooks/useMedia';
import { PublicProfileDetailsView } from '../../../public-profile/pages';
import { CastingApplicantCard } from '../components/Card';
import CastingApplicantsFilterBar from '../components/Filter/CastingApplicantsFilterBar';
import CastingApplicantsDataGrid from '../components/Table/CastingApplicantsDataGrid';
import { useEmployerCastingApplicants } from '../hooks/useEmployerCastingApplicants';
import type {
  EmployerCastingApplicantsFiltersState,
  EmployerCastingApplicantsOrderBy,
} from '../types/employerCastingApplicantsFilter.types';
import CastingApplicantsGallery from '../components/Gallery/CastingApplicantsGallery';

type ApplicantsViewMode = 'table' | 'gallery';

const EmployerCastingApplicantsPage = () => {
  const { t } = useTranslation();
  const isDesktop = useMedia(LG_SCREEN_SIZE);
  const { slug } = useParams<{ slug: string }>();

  if (!slug) return null;

  const [filters, setFilters] = useState<EmployerCastingApplicantsFiltersState>({
    applicationStatusIdTokens: undefined,
    professionIds: undefined,
    search: undefined,
  });
  const [orderBy, setOrderBy] = useState<EmployerCastingApplicantsOrderBy>('CREATION_DATE_DESC');
  const [page, setPage] = useState(0);
  const pageSize = 8;
  const [selectedPublicSlug, setSelectedPublicSlug] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ApplicantsViewMode>('table');

  const args = useMemo(
    () => ({
      slug,
      page,
      size: pageSize,
      filters,
      orderBy,
    }),
    [slug, page, filters, orderBy]
  );

  useEffect(() => {
    setPage(0);
  }, [slug, filters, orderBy]);

  const { data } = useEmployerCastingApplicants(args);
  const applicants = data?.items ?? [];
  const title = applicants.length > 0 ? `${applicants[0].castingTitle}` : '';

  const handleOpenDetails = useCallback((talentPublicSlug: string) => {
    setSelectedPublicSlug(talentPublicSlug);
    setDetailsOpen(true);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setDetailsOpen(false);
    setSelectedPublicSlug(null);
  }, []);

  const resolvedViewMode: ApplicantsViewMode = isDesktop ? viewMode : 'table';

  return (
    <DashboardShell>
      <DashboardSection>
        <SectionTitle title={t('employer_casting_applicants.page.title') + ' ' + title} />

        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <CastingApplicantsFilterBar
              filters={filters}
              onFiltersChange={setFilters}
              orderBy={orderBy}
              onOrderByChange={setOrderBy}
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

        {applicants.length === 0 ? (
          <Label className="w-full text-center text-(--color-secondary-grey-fonts) pt-10">
            {t('employer_casting_applicants.page.empty_page')}
          </Label>
        ) : resolvedViewMode === 'gallery' ? (
          <CastingApplicantsGallery data={applicants}></CastingApplicantsGallery>
        ) : isDesktop ? (
          <div className="w-full flex flex-col gap-6">
            <CastingApplicantsDataGrid
              data={applicants}
              page={data?.page ?? page}
              hasNext={data?.hasNext ?? false}
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
