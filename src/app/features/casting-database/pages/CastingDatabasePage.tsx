import {
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
import { CastingDetailsDesktopBody } from '../../../shared/components/CastingDetails';
import FilterToggleButton from '../../../shared/components/FilterToggleButton/FilterToggleButton';
import { FiltersDrawerActionBar, FiltersDrawerShell } from '../../../shared/components/FiltersDrawer';
import ServerError from '../../../shared/components/ServerError/ServerError';
import { usePublicCastingDetails } from '../../public-casting/hooks/usePublicCastingDetails';
import { useCachedSiteMetadataSlice } from '../../sitemetadata/hooks/useCachedSiteMetadata';
import {
  CastingCatalogDetailsApplyAction,
  CastingCatalogPagination,
  CastingDatabaseMobileList,
  CastingFilterBar,
  CastingMobileFiltersDrawer,
  CastingRolePublicCard,
} from '../components';
import { useCastingDatabasePage } from '../hooks/useCastingDatabasePage';
import type { CastingFiltersQS, CastingRolePublicCardResponse } from '../types/casting-database.types';
import { getCastingFilterCounts } from '../utils/castingDatabaseFilterCounts';

const PAGE_SIZE = 8;

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

type CardsPaneHeaderProps = {
  title: string;
  filtersOpen: boolean;
  activeFilterCount: number;
  onToggleFilters: () => void;
  t: (key: string) => string;
};

function CardsPaneHeader({ title, filtersOpen, activeFilterCount, onToggleFilters, t }: CardsPaneHeaderProps) {
  return (
    <div className="sticky top-0 z-10 overflow-visible bg-(--color-secondary-white) pb-5">
      <div className="flex items-center justify-between gap-4 overflow-visible">
        <h1 className="text-2xl font-bold text-(--color-primary-black) leading-tight">{title}</h1>
        <FilterToggleButton
          open={filtersOpen}
          count={activeFilterCount}
          onClick={onToggleFilters}
          ariaLabel={filtersOpen ? t('general.filter.hide') : t('general.filter.show')}
          ariaPressed={filtersOpen}
        />
      </div>
    </div>
  );
}

function CardsPaneLayout({
  title,
  filtersOpen,
  activeFilterCount,
  onToggleFilters,
  t,
  children,
  footer,
  contentRef,
}: CardsPaneHeaderProps & {
  children: React.ReactNode;
  footer?: React.ReactNode;
  contentRef?: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden">
      <CardsPaneHeader
        title={title}
        filtersOpen={filtersOpen}
        activeFilterCount={activeFilterCount}
        onToggleFilters={onToggleFilters}
        t={t}
      />
      <div ref={contentRef} data-casting-cards-pane className="flex-1 min-h-0 overflow-y-auto pr-2">
        {children}
      </div>
      {footer ? <div className="shrink-0 pt-4">{footer}</div> : null}
    </div>
  );
}

const CastingDatabasePage = () => {
  useViewportVhVar();
  const { t } = useTranslation(undefined, { useSuspense: false });
  const { header, footer } = useChromeBoxHeights();
  const isDesktop = useMedia(LG_SCREEN_SIZE);
  const skillsRaw = useCachedSiteMetadataSlice('skills');
  const viewportHeight = `calc(var(--app-vh, 1vh) * 100 - ${header + footer}px)`;
  const desktopPaneHeight = `calc(var(--app-vh, 1vh) * 100 - ${header + footer + 48}px)`;

  const [filters, setFilters] = useState<CastingFiltersQS>(initialFilters);
  const [desktopDraftFilters, setDesktopDraftFilters] = useState<CastingFiltersQS>(initialFilters);
  const desktopDraftFiltersRef = useRef<CastingFiltersQS>(initialFilters);
  const debouncedFilters = useDebouncedValue(filters, 350);
  const [page, setPage] = useState(0);
  const [selectedItem, setSelectedItem] = useState<CastingRolePublicCardResponse | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const menuScrollRef = useRef<HTMLDivElement>(null);
  const cardsPaneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (filtersOpen) {
      setDesktopDraftFilters(filters);
      desktopDraftFiltersRef.current = filters;
    }
  }, [filters, filtersOpen]);

  const firstRenderRef = useRef(true);
  useEffect(() => {
    firstRenderRef.current = false;
  }, []);

  const effectiveFilters = firstRenderRef.current ? filters : debouncedFilters;
  const activeFilterCount = useMemo(
    () => getCastingFilterCounts(filtersOpen ? desktopDraftFilters : filters, skillsRaw).totalCount,
    [desktopDraftFilters, filters, filtersOpen, skillsRaw]
  );

  useEffect(() => {
    setPage(0);
  }, [effectiveFilters]);

  const scrollCardsToTop = () => {
    menuScrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
    if (menuScrollRef.current) {
      menuScrollRef.current.scrollTop = 0;
    }

    cardsPaneRef.current?.scrollTo({ top: 0, behavior: 'auto' });
    if (cardsPaneRef.current) {
      cardsPaneRef.current.scrollTop = 0;
    }

    window.scrollTo({ top: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const handleDesktopPageChange = (nextPage: number) => {
    scrollCardsToTop();
    requestAnimationFrame(() => scrollCardsToTop());
    setPage(nextPage);
  };

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
        <CardsPaneLayout
          title={t('casting-database.page.title')}
          filtersOpen={filtersOpen}
          activeFilterCount={activeFilterCount}
          onToggleFilters={() => setFiltersOpen((value) => !value)}
          t={t}
        >
          <div className="flex flex-col gap-5 pb-4">
            {Array.from({ length: PAGE_SIZE }).map((_, index) => (
              <Skeleton
                key={`casting-card-skeleton-${index}`}
                className="h-[176px] w-full max-w-[390px] rounded-[24px]"
              />
            ))}
          </div>
        </CardsPaneLayout>
      );
    }

    if (desktopListingQuery.error) {
      return (
        <CardsPaneLayout
          title={t('casting-database.page.title')}
          filtersOpen={filtersOpen}
          activeFilterCount={activeFilterCount}
          onToggleFilters={() => setFiltersOpen((value) => !value)}
          t={t}
        >
          <p className="py-10 text-center font-normal text-(--color-alert-error)">{t('state.server_err')}</p>
        </CardsPaneLayout>
      );
    }

    if (items.length === 0) {
      return (
        <CardsPaneLayout
          title={t('casting-database.page.title')}
          filtersOpen={filtersOpen}
          activeFilterCount={activeFilterCount}
          onToggleFilters={() => setFiltersOpen((value) => !value)}
          t={t}
        >
          <p className="py-10 text-center font-light text-(--color-secondary-grey-fonts)">{t('state.no_results')}</p>
        </CardsPaneLayout>
      );
    }

    return (
      <CardsPaneLayout
        title={t('casting-database.page.title')}
        filtersOpen={filtersOpen}
        activeFilterCount={activeFilterCount}
        onToggleFilters={() => setFiltersOpen((value) => !value)}
        t={t}
        footer={
          <CastingCatalogPagination
            page={page}
            size={PAGE_SIZE}
            hasNext={hasNext}
            totalCount={totalCount}
            onPageChange={handleDesktopPageChange}
          />
        }
        contentRef={cardsPaneRef}
      >
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <CastingRolePublicCard
              key={item.id}
              item={item}
              selected={item.id === selectedItem?.id}
              onSelect={setSelectedItem}
            />
          ))}
        </div>
      </CardsPaneLayout>
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
    activeFilterCount,
  ]);

  const contentHeader = useMemo(() => {
    if (detailsQuery.data) {
      return (
        <div className="flex min-w-0 flex-col">
          <h2 className="text-xl font-semibold">{detailsQuery.data.casting.roles[0]?.roleName}</h2>
          <p className="text-sm font-light text-(--color-secondary-grey-fonts)">{detailsQuery.data.casting.title}</p>
        </div>
      );
    }

    return (
      <div className="flex min-w-0 flex-col">
        <h2 className="text-xl font-semibold">{t('casting-database.page.title')}</h2>
      </div>
    );
  }, [detailsQuery.data, t]);

  const contentActions = useMemo(() => {
    if (!detailsQuery.data) return undefined;

    return <CastingCatalogDetailsApplyAction data={detailsQuery.data} />;
  }, [detailsQuery.data]);

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

    return <CastingDetailsDesktopBody casting={detailsQuery.data.casting} />;
  }, [detailsQuery.data, detailsQuery.error, detailsQuery.isLoading, selectedItem, t]);

  return (
    <section
      className="w-full min-h-0 overflow-visible lg:overflow-hidden bg-(--color-secondary-white)"
      style={{ height: viewportHeight, minHeight: viewportHeight, maxHeight: viewportHeight }}
    >
      <div className="h-full w-full flex flex-col">
        <div className="flex-1 min-h-0 w-full min-w-0 flex flex-col gap-6 overflow-visible lg:flex-row lg:gap-0">
          <div className="min-w-0 flex-1 h-full flex flex-col lg:px-[40px] lg:py-[24px]">
            <div className="mx-auto flex w-full max-w-[1500px] flex-1 min-h-0 h-full flex-col gap-6">
              {isDesktop ? (
                <MasterDetailShell
                  menu={menu}
                  content={content}
                  contentHeader={contentHeader}
                  contentActions={contentActions}
                  menuContentRef={menuScrollRef}
                  desktopPaneHeight={desktopPaneHeight}
                />
              ) : (
                <>
                  <CastingDatabaseMobileList
                    filters={effectiveFilters}
                    activeFilterCount={getCastingFilterCounts(filters, skillsRaw).totalCount}
                    onOpenFilters={() => setMobileOpen(true)}
                  />
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

        <FiltersDrawerShell
          open={isDesktop && filtersOpen}
          onClose={() => setFiltersOpen(false)}
          variant="desktop"
          footer={
            <FiltersDrawerActionBar
              onReset={() => {
                setDesktopDraftFilters({} as CastingFiltersQS);
                desktopDraftFiltersRef.current = {} as CastingFiltersQS;
                setFilters(initialFilters);
                setFiltersOpen(false);
              }}
              onApply={() => {
                setFilters(desktopDraftFiltersRef.current);
                setFiltersOpen(false);
              }}
            />
          }
        >
          <CastingFilterBar
            value={desktopDraftFilters}
            onChange={(next) => {
              desktopDraftFiltersRef.current = next;
              setDesktopDraftFilters(next);
            }}
            onClose={() => setFiltersOpen(false)}
          />
        </FiltersDrawerShell>
      </div>
    </section>
  );
};

export default CastingDatabasePage;
