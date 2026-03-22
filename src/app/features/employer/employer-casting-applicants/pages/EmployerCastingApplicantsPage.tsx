import { Label } from 'autocasting-ui-library-padimasso';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { DashboardSection, DashboardShell } from '../../../../layouts/components';
import { SectionTitle } from '../../../../shared/components/Section';
import { LG_SCREEN_SIZE, useMedia } from '../../../../shared/hooks/useMedia';
import { PublicProfileDetailsView } from '../../../public-profile/pages';
import { getPublicProfile } from '../../../public-profile/services/publicProfileService';
import type { TalentPublicProfileResponse } from '../../../talent/talent-profile-edit/types/talentProfile.types';
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

  const [filters] = useState<EmployerCastingApplicantsFiltersState>({
    roleIds: undefined,
    applicationStatusIdTokens: undefined,
    professionIds: undefined,
    search: undefined,
  });
  const [orderBy] = useState<EmployerCastingApplicantsOrderBy>('CREATION_DATE_DESC');
  const [selectedProfile, setSelectedProfile] = useState<TalentPublicProfileResponse | null>(null);
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

  const handleOpenDetails = useCallback(async (talentPublicSlug: string) => {
    try {
      const full = await getPublicProfile(talentPublicSlug);
      setSelectedProfile(full);
      setDetailsOpen(true);
    } catch (e) {
      console.error('Error loading profile details', e);
    }
  }, []);

  const handleCloseDetails = useCallback(() => {
    setDetailsOpen(false);
    setSelectedProfile(null);
  }, []);

  return (
    <DashboardShell>
      <DashboardSection>
        <SectionTitle title={t('employer_casting_applicants.page.title') + ' ' + title} />

        {/* Filter Bar */}
        <CastingApplicantsFilterBar />

        {/* Cards */}
        <div className="w-full flex flex-col flex-wrap gap-6 lg:flex-row">
          {applicants.length > 0 ? (
            applicants.map((i) => (
              <CastingApplicantCard key={i.applicationId} data={i} onOpenDetails={handleOpenDetails} />
            ))
          ) : (
            <Label className="w-full text-center text-[var(--color-secondary-grey-fonts)] pt-10">
              {t('employer_casting_applicants.page.empty_page')}
            </Label>
          )}
        </div>
      </DashboardSection>

      {isDesktop && (
        <PublicProfileDetailsView
          open={detailsOpen && !!selectedProfile}
          onClose={handleCloseDetails}
          profile={selectedProfile ?? null}
        />
      )}
    </DashboardShell>
  );
};

export default EmployerCastingApplicantsPage;
