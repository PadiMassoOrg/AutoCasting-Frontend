import {
  Label,
  LG_SCREEN_SIZE,
  MasterDetailShell,
  SectionCard,
  Separator,
  Skeleton,
  useChromeBoxHeights,
  useMedia,
  useViewportVhVar,
} from 'autocasting-ui-library-padimasso';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { CastingDetailsDesktopBody } from '../../../shared/components/CastingDetails';
import ServerError from '../../../shared/components/ServerError/ServerError';
import { CastingCatalogDetailsApplyAction, CastingRolePublicCard } from '../../casting-database/components';
import type { CastingRolePublicCardResponse } from '../../casting-database/types/casting-database.types';
import { usePublicCastingDetails } from '../hooks/usePublicCastingDetails';
import { usePublicCastingOverview } from '../hooks/usePublicCastingOverview';
import type { PublicCastingData, PublicCastingRole } from '../types/publicCasting.types';

function mapRoleToCard(role: PublicCastingRole, casting: PublicCastingData): CastingRolePublicCardResponse {
  return {
    id: role.id,
    name: role.roleName,
    castingTitle: casting.title,
    employerImageUrl: casting.employerInfo?.imageUrl ?? '',
    projectType: casting.projectType,
    shootingStartDate: casting.shootingStartDate,
    shootingEndDate: casting.shootingEndDate,
    roleType: role.roleType ?? { id: '', stringCode: 'general.not_specified' },
    gender: role.gender ?? { id: '', stringCode: 'general.not_specified' },
    ageMin: role.ageMin ?? 0,
    ageMax: role.ageMax ?? 0,
    defaultCode: casting.slug,
  };
}

const CastingPublicOverviewPage = () => {
  useViewportVhVar();
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isDesktop = useMedia(LG_SCREEN_SIZE);
  const { header, footer } = useChromeBoxHeights();
  const viewportHeight = `calc(var(--app-vh, 1vh) * 100 - ${header + footer}px)`;
  const desktopPaneHeight = `calc(var(--app-vh, 1vh) * 100 - ${header + footer + 48}px)`;
  const menuScrollRef = useRef<HTMLDivElement>(null);

  const overviewQuery = usePublicCastingOverview({ slug: slug! }, { enabled: !!slug });
  const casting = overviewQuery.data?.casting ?? null;
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

  const items = useMemo(() => {
    if (!casting) return [];
    return casting.roles.map((role) => mapRoleToCard(role, casting));
  }, [casting]);

  useEffect(() => {
    if (!items.length) {
      setSelectedRoleId(null);
      return;
    }

    setSelectedRoleId((current) => {
      if (current && items.some((item) => item.id === current)) return current;
      return items[0].id;
    });
  }, [items]);

  const selectedItem = useMemo(() => items.find((item) => item.id === selectedRoleId) ?? null, [items, selectedRoleId]);

  const detailsQuery = usePublicCastingDetails(
    {
      slug: slug ?? '',
      roleId: selectedRoleId ?? '',
    },
    {
      enabled: Boolean(slug && selectedRoleId && isDesktop),
    }
  );

  if (overviewQuery.isError) return <ServerError />;
  if (overviewQuery.isLoading || !casting) {
    return (
      <Label className="w-full pt-10 flex items-center justify-center text-center text-[var(--color-secondary-grey-fonts)]">
        {t('state.loading')}
      </Label>
    );
  }

  const menuHeader = (
    <div className="sticky top-0 z-10 bg-(--color-secondary-white) pb-5">
      <div className="flex min-w-0 flex-col">
        <h2 className="truncate text-2xl font-semibold">{casting.title}</h2>
        <p className="text-sm font-light text-(--color-secondary-grey-fonts)">{t(casting.projectType.stringCode)}</p>
      </div>
    </div>
  );

  const menuContent =
    items.length === 0 ? (
      <p className="py-10 text-center font-light text-(--color-secondary-grey-fonts)">{t('state.no_results')}</p>
    ) : (
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <CastingRolePublicCard
            key={item.id}
            item={item}
            selected={item.id === selectedItem?.id}
            onSelect={(current) => setSelectedRoleId(current.id)}
          />
        ))}
      </div>
    );

  const contentHeader = detailsQuery.data ? (
    <div className="flex min-w-0 flex-col">
      <h2 className="text-xl font-semibold">{detailsQuery.data.casting.roles[0]?.roleName}</h2>
      <p className="text-sm font-light text-(--color-secondary-grey-fonts)">{detailsQuery.data.casting.title}</p>
    </div>
  ) : (
    <div className="flex min-w-0 flex-col">
      <h2 className="text-xl font-semibold">{casting.title}</h2>
    </div>
  );

  const contentActions = detailsQuery.data ? <CastingCatalogDetailsApplyAction data={detailsQuery.data} /> : undefined;

  const content = (() => {
    if (!selectedItem) {
      return (
        <div className="flex h-full items-center justify-center p-8">
          <p className="text-center font-light text-(--color-secondary-grey-fonts)">{t('state.no_results')}</p>
        </div>
      );
    }

    if (detailsQuery.isLoading && !detailsQuery.data) {
      return (
        <div className="flex flex-col gap-5 p-6 lg:p-8">
          <Skeleton className="h-12 w-2/5 rounded-xl" />
          <Skeleton className="h-8 w-40 rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      );
    }

    if (detailsQuery.error) return <ServerError />;
    if (!detailsQuery.data) return null;

    return <CastingDetailsDesktopBody casting={detailsQuery.data.casting} />;
  })();

  if (isDesktop) {
    return (
      <section
        className="w-full min-h-0 overflow-hidden bg-(--color-secondary-white)"
        style={{ height: viewportHeight, minHeight: viewportHeight, maxHeight: viewportHeight }}
      >
        <div className="h-full w-full flex flex-col">
          <div className="flex-1 min-h-0 w-full min-w-0 flex flex-col gap-6 overflow-hidden lg:flex-row lg:gap-0">
            <div className="min-w-0 flex-1 h-full flex flex-col lg:px-[40px] lg:py-[24px]">
              <div className="mx-auto flex w-full max-w-[1500px] flex-1 min-h-0 h-full flex-col gap-6">
                <MasterDetailShell
                  menuHeader={menuHeader}
                  menuContent={menuContent}
                  content={content}
                  contentHeader={contentHeader}
                  contentActions={contentActions}
                  menuContentRef={menuScrollRef}
                  desktopPaneHeight={desktopPaneHeight}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <main className="relative flex flex-col gap-6">
      <SectionCard className="flex flex-col gap-4">
        <div className="flex min-w-0 flex-col">
          <h1 className="truncate text-2xl font-semibold">{casting.title}</h1>
          <p className="text-sm font-light text-(--color-secondary-grey-fonts)">{t(casting.projectType.stringCode)}</p>
        </div>
      </SectionCard>

      <Separator className="opacity-0 my-1" />

      <div className="flex flex-col gap-6">
        {items.map((item) => (
          <CastingRolePublicCard
            key={item.id}
            item={item}
            onSelect={(current) => navigate(`/casting/${current.defaultCode}/roles/${current.id}`)}
          />
        ))}
      </div>
    </main>
  );
};

export default CastingPublicOverviewPage;
