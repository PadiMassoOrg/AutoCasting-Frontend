import { Label } from 'autocasting-ui-library-padimasso';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { DashboardSection, DashboardShell } from '../../../../layouts/components';
import { SectionTitle } from '../../../../shared/components/Section';
import { LG_SCREEN_SIZE, useMedia } from '../../../../shared/hooks/useMedia';
import { PublicProfileDetailsView } from '../../../public-profile/pages';
import { CastingApplicantCard } from '../components/Card';
import CastingApplicantsFilterBar from '../components/Filter/CastingApplicantsFilterBar';
import { useEmployerCastingApplicants } from '../hooks/useEmployerCastingApplicants';
import type {
  EmployerCastingApplicantsFiltersState,
  EmployerCastingApplicantsOrderBy,
} from '../types/employerCastingApplicantsFilter.types';

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
  const [selectedPublicSlug, setSelectedPublicSlug] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const args = useMemo(
    () => ({
      slug,
      page: 0,
      size: 10,
      filters,
      orderBy,
    }),
    [slug, filters, orderBy]
  );

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

  return (
    <DashboardShell>
      <DashboardSection>
        <SectionTitle title={t('employer_casting_applicants.page.title') + ' ' + title} />

        <CastingApplicantsFilterBar
          filters={filters}
          onFiltersChange={setFilters}
          orderBy={orderBy}
          onOrderByChange={setOrderBy}
        />

        <div className="w-full flex flex-col flex-wrap gap-6 lg:flex-row">
          {applicants.length > 0 ? (
            applicants.map((i) => (
              <CastingApplicantCard
                key={i.applicationId}
                data={i}
                isDesktop={isDesktop}
                onOpenDetails={handleOpenDetails}
              />
            ))
          ) : (
            <Label className="w-full text-center text-[var(--color-secondary-grey-fonts)] pt-10">
              {t('employer_casting_applicants.page.empty_page')}
            </Label>
          )}
        </div>
      </DashboardSection>

      {isDesktop && (
        <PublicProfileDetailsView open={detailsOpen} onClose={handleCloseDetails} publicSlug={selectedPublicSlug} />
      )}
    </DashboardShell>
  );
};

export default EmployerCastingApplicantsPage;
