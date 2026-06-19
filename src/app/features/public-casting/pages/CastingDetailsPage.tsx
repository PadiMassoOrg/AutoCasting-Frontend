import {
  Label,
  LG_SCREEN_SIZE,
  MobileBottomBar,
  SectionCard,
  Separator,
  useMedia,
} from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { CastingDetailsDesktopBody, CastingDetailsMobileBody } from '../../../shared/components/CastingDetails';
import { NotFoundPage, ServerErrorPage } from '../../../shared/components/ErrorPage';
import { isBackendNotFoundError } from '../../../shared/utils/backendErrorHandling';
import { CastingCatalogDetailsApplyAction } from '../../casting-database/components';
import { usePublicCastingDetails } from '../hooks/usePublicCastingDetails';

const CastingDetailsPage = () => {
  const { t } = useTranslation();
  const { slug, roleId } = useParams<{ slug: string; roleId?: string }>();
  const isDesktop = useMedia(LG_SCREEN_SIZE);

  const publicQuery = usePublicCastingDetails({ slug: slug!, roleId: roleId! });

  if (publicQuery.error) return isBackendNotFoundError(publicQuery.error) ? <NotFoundPage /> : <ServerErrorPage />;
  if (publicQuery.isLoading || !publicQuery.data) {
    return (
      <Label className="w-full pt-10 flex items-center justify-center text-center text-[var(--color-secondary-grey-fonts)]">
        {t('state.loading')}
      </Label>
    );
  }

  const casting = publicQuery.data.casting;
  const selectedRole = casting.roles?.[0] ?? null;

  if (isDesktop) {
    return (
      <SectionCard className="flex flex-col gap-6">
        <section className="flex items-start justify-between">
          <div className="w-full">
            <h2 className="text-3xl font-semibold">{selectedRole?.roleName}</h2>
            <p className="text-base font-light text-(--color-secondary-grey-fonts)">{casting.title}</p>
          </div>
          <CastingCatalogDetailsApplyAction data={publicQuery.data} />
        </section>

        <Separator className="opacity-0 my-4" />

        <CastingDetailsDesktopBody casting={publicQuery.data.casting} />
      </SectionCard>
    );
  }

  return (
    <main className="relative flex flex-col">
      <SectionCard className="mb-16">
        <CastingDetailsMobileBody casting={casting} />
      </SectionCard>

      <MobileBottomBar>
        <CastingCatalogDetailsApplyAction data={publicQuery.data} />
      </MobileBottomBar>
    </main>
  );
};

export default CastingDetailsPage;
