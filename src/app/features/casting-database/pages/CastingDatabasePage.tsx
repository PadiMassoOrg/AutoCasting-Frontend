import {
  Icon,
  LG_SCREEN_SIZE,
  MasterDetailShell,
  Skeleton,
  useChromeBoxHeights,
  useDebouncedValue,
  useMedia,
  useViewportVhVar,
} from 'autocasting-ui-library-padimasso';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ServerError from '../../../shared/components/ServerError/ServerError';
import { usePublicCastingDetails } from '../../public-casting/hooks/usePublicCastingDetails';
import {
  CastingCatalogDetailsPanel,
  CastingCatalogPagination,
  CastingDatabaseMobileList,
  CastingFilterBar,
  CastingMobileFiltersDrawer,
  CastingRolePublicCard,
} from '../components';
import { useCastingDatabasePage } from '../hooks/useCastingDatabasePage';
import type { CastingFiltersQS, CastingRolePublicCardResponse } from '../types/casting-database.types';

const PAGE_SIZE = 5;

const initialFilters: CastingFiltersQS = {
  roleName: '',
  genderIds: ['NULL'],
  ethnicityIds: ['NULL'],
  hairColorIds: undefined,
  hairColorIdsMode: 'ANY',
  eyeColorIds: undefined,
  eyeColorIdsMode: 'ANY',
  ageMin: undefined,
  ageMax: undefined,
  heightMinCm: undefined,
  heightMaxCm: undefined,
  professionId: undefined,
  skillId: undefined,
  tattoo: undefined,
  passport: undefined,
  drivingLicense: undefined,
  professionsMode: 'ANY',
  skillsMode: 'ANY',
  projectTypeIds: undefined,
  castingModalityIds: undefined,
  locationText: undefined,
};

const CastingDatabasePage = () => {
  useViewportVhVar();
  const { t } = useTranslation(undefined, { useSuspense: false });
  const { header, footer } = useChromeBoxHeights();
  const isDesktop = useMedia(LG_SCREEN_SIZE);
  const pageViewportHeight = `calc(var(--app-vh, 1vh) * 100 - ${header + footer}px)`;
  const desktopFilterHeight = `calc(var(--app-vh, 1vh) * 100 - ${header + footer}px)`;
  const desktopPaneHeight = `calc(var(--app-vh, 1vh) * 100 - ${header + footer + 48}px)`;

  const [filters, setFilters] = useState<CastingFiltersQS>(initialFilters);
  const debouncedFilters = useDebouncedValue(filters, 350);
  const [page, setPage] = useState(0);
  const [selectedItem, setSelectedItem] = useState<CastingRolePublicCardResponse | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const firstRenderRef = useRef(true);
  useEffect(() => {
    firstRenderRef.current = false;
  }, []);

  const effectiveFilters = firstRenderRef.current ? filters : debouncedFilters;

  useEffect(() => {
    setPage(0);
  }, [effectiveFilters]);

  const desktopListingQuery = useCastingDatabasePage({
    page,
    size: PAGE_SIZE,
    filters: effectiveFilters,
    enabled: isDesktop,
  });

  const items = desktopListingQuery.data?.items ?? [];
  const hasNext = Boolean(desktopListingQuery.data?.hasNext);
  const totalCount = desktopListingQuery.data?.totalCount ?? null;

  useEffect(() => {
    if (!isDesktop) return;
    if (items.length === 0) {
      setSelectedItem(null);
      return;
    }

    setSelectedItem((current) => {
      if (!current) return items[0];
      const sameItem = items.find((item) => item.id === current.id);
      return sameItem ?? items[0];
    });
  }, [isDesktop, items]);

  const detailsQuery = usePublicCastingDetails(
    {
      slug: selectedItem?.defaultCode ?? '',
      roleId: selectedItem?.id ?? '',
    },
    {
      enabled: !!selectedItem,
    }
  );

  const menu = useMemo(() => {
    if (desktopListingQuery.isLoading && !desktopListingQuery.data) {
      return (
        <div className="flex min-h-full w-full flex-col">
          <div className="sticky top-0 z-10 bg-(--color-secondary-white) pb-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold">{t('casting-database.page.title')}</h2>
              <button
                type="button"
                className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-(--color-secondary-outline) bg-(--color-primary-white)"
                onClick={() => setFiltersOpen((value) => !value)}
                aria-label={filtersOpen ? t('general.filter.hide') : t('general.filter.show')}
                aria-pressed={filtersOpen}
              >
                <Icon name="filter" variant="primary" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-5 pb-4">
            {Array.from({ length: PAGE_SIZE }).map((_, index) => (
              <Skeleton
                key={`casting-card-skeleton-${index}`}
                className="h-[176px] w-full max-w-[390px] rounded-[24px]"
              />
            ))}
          </div>
        </div>
      );
    }

    if (desktopListingQuery.error) {
      return <p className="py-10 text-center font-normal text-(--color-alert-error)">{t('state.server_err')}</p>;
    }

    if (items.length === 0) {
      return (
        <p className="py-10 text-center font-light text-(--color-secondary-grey-fonts)">{t('state.no_results')}</p>
      );
    }

    return (
      <div className="flex min-h-full w-full flex-col">
        <div className="sticky top-0 z-10 bg-(--color-secondary-white) pb-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">{t('casting-database.page.title')}</h2>
            <button
              type="button"
              className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-(--color-secondary-outline) bg-(--color-primary-white)"
              onClick={() => setFiltersOpen((value) => !value)}
              aria-label={filtersOpen ? t('general.filter.hide') : t('general.filter.show')}
              aria-pressed={filtersOpen}
            >
              <Icon name="filter" variant="primary" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-5 pb-5">
          {items.map((item) => (
            <CastingRolePublicCard
              key={item.id}
              item={item}
              selected={item.id === selectedItem?.id}
              onSelect={setSelectedItem}
            />
          ))}
        </div>

        <div className="mt-auto w-full pt-2">
          <CastingCatalogPagination
            page={page}
            size={PAGE_SIZE}
            hasNext={hasNext}
            totalCount={totalCount}
            onPageChange={setPage}
          />
        </div>
      </div>
    );
  }, [
    hasNext,
    items,
    desktopListingQuery.data,
    desktopListingQuery.error,
    desktopListingQuery.isLoading,
    filtersOpen,
    page,
    selectedItem?.id,
    t,
    totalCount,
  ]);

  const content = useMemo(() => {
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

    if (detailsQuery.error) {
      return <ServerError />;
    }

    if (!detailsQuery.data) {
      return null;
    }

    return <CastingCatalogDetailsPanel data={detailsQuery.data} selectedRoleId={selectedItem.id} />;
  }, [detailsQuery.data, detailsQuery.error, detailsQuery.isLoading, selectedItem, t]);

  return (
    <section
      className="w-full min-h-0 overflow-hidden bg-(--color-secondary-white)"
      style={{ height: pageViewportHeight, minHeight: pageViewportHeight, maxHeight: pageViewportHeight }}
    >
      <div className="h-full w-full flex flex-col">
        <div className="flex-1 min-h-0 w-full min-w-0 flex flex-col gap-6 overflow-hidden lg:flex-row lg:gap-0">
          {isDesktop && filtersOpen ? (
            <aside
              className="hidden self-stretch border-r border-(--color-secondary-outline) bg-(--color-primary-white) lg:flex lg:w-[330px] lg:flex-col lg:sticky lg:self-start"
              style={{ top: `${header}px`, height: desktopFilterHeight }}
            >
              <div className="h-full min-h-0 flex-1 overflow-y-auto overscroll-contain p-5">
                <CastingFilterBar value={filters} onChange={setFilters} onReset={() => setFilters(initialFilters)} />
              </div>
            </aside>
          ) : null}

          <div className="min-w-0 flex-1 h-full flex flex-col lg:px-[40px] lg:py-[24px]">
            <div className="mx-auto flex w-full max-w-[1500px] flex-1 min-h-0 h-full flex-col gap-6">
              {isDesktop ? (
                <MasterDetailShell
                  menu={menu}
                  content={content}
                  rootClassName="w-full h-full min-h-0 bg-transparent"
                  menuPaneWidthClassName="lg:w-[390px]"
                  menuPaneClassName="border-0 bg-transparent rounded-none"
                  menuContentClassName="scrollbar-hide"
                  contentPaneClassName="rounded-[24px]"
                  desktopPaneHeight={desktopPaneHeight}
                />
              ) : (
                <>
                  <CastingDatabaseMobileList filters={effectiveFilters} onOpenFilters={() => setMobileOpen(true)} />
                </>
              )}
            </div>
          </div>
        </div>

        <CastingMobileFiltersDrawer
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          value={filters}
          onReset={() => setFilters(initialFilters)}
          onApply={(next) => setFilters(next)}
        />
      </div>
    </section>
  );
};

export default CastingDatabasePage;
