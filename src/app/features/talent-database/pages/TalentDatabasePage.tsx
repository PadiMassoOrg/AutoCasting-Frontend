import {
  LG_SCREEN_SIZE,
  Skeleton,
  useDebouncedValue,
  useMedia,
  useViewportVhVar,
} from 'autocasting-ui-library-padimasso';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FetchErrorState } from '../../../shared/components/FetchErrorState';
import { FiltersDrawerActionBar, FiltersDrawerShell } from '../../../shared/components/FiltersDrawer';
import FilterToggleButton from '../../../shared/components/FilterToggleButton/FilterToggleButton';
import { usePreservedScroll } from '../../../shared/hooks/usePreservedScroll';
import { PublicProfileDetailsView } from '../../public-profile/pages';
import { useCachedSiteMetadataSlice } from '../../sitemetadata/hooks/useCachedSiteMetadata';
import { TalentCard, TalentFilterBar, TalentMobileFilterDrawer } from '../components';
import { useTalentDatabaseInfinite } from '../hooks/useTalentDatabaseInfinite';
import type { ProfileCardResponse, TalentFiltersQS } from '../types/talent-database.types';
import { getTalentFilterCounts } from '../utils/talentDatabaseFilterCounts';

const initialFilters: TalentFiltersQS = {
  includeNoHeadshot: undefined,
  stageName: '',
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
};

const GRID_GAP_PX = 16;
const MIN_CARD_WIDTH_PX = 260;

export default function TalentDatabasePage() {
  useViewportVhVar();
  const { t } = useTranslation(undefined, { useSuspense: false });
  const isDesktop = useMedia(LG_SCREEN_SIZE);
  const pageSize = isDesktop ? 12 : 6;
  const skillsRaw = useCachedSiteMetadataSlice('skills');

  const [filters, setFilters] = useState<TalentFiltersQS>(initialFilters);
  const [desktopDraftFilters, setDesktopDraftFilters] = useState<TalentFiltersQS>(initialFilters);
  const desktopDraftFiltersRef = useRef<TalentFiltersQS>(initialFilters);
  const debouncedFilters = useDebouncedValue(filters, 350);

  const firstRenderRef = useRef(true);
  useEffect(() => {
    firstRenderRef.current = false;
  }, []);
  const effectiveFilters = firstRenderRef.current ? filters : debouncedFilters;

  const [selectedPublicSlug, setSelectedPublicSlug] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { captureScroll } = usePreservedScroll(detailsOpen);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const cardsGridRef = useRef<HTMLElement>(null);
  const resizeRafRef = useRef<number | null>(null);
  const [gridCols, setGridCols] = useState(1);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useTalentDatabaseInfinite({
    pageSize,
    filters: effectiveFilters,
  });

  const items = useMemo<ProfileCardResponse[]>(
    () => (data?.pages ?? []).flatMap((slice) => slice.items ?? []),
    [data?.pages]
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [effectiveFilters, pageSize]);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);

  useEffect(() => {
    if (filtersOpen) {
      setDesktopDraftFilters(filters);
      desktopDraftFiltersRef.current = filters;
    }
  }, [filters, filtersOpen]);

  useEffect(() => {
    const target = sentinelRef.current;
    if (!target) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting) return;
        if (!hasNextPage || isFetchingNextPage) return;
        void fetchNextPage();
      },
      { root: null, rootMargin: '600px 0px 800px 0px', threshold: 0 }
    );

    io.observe(target);
    return () => io.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const gridEl = cardsGridRef.current;
    if (!gridEl) return;

    const maxCols = filtersOpen ? 4 : 4;
    const computeCols = (width: number) => {
      const estimated = Math.floor((width + GRID_GAP_PX) / (MIN_CARD_WIDTH_PX + GRID_GAP_PX));
      return Math.max(1, Math.min(maxCols, estimated));
    };

    const updateCols = (width: number) => {
      const nextCols = computeCols(width);
      setGridCols((prev) => (prev === nextCols ? prev : nextCols));
    };

    updateCols(gridEl.getBoundingClientRect().width);

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      if (resizeRafRef.current !== null) cancelAnimationFrame(resizeRafRef.current);
      resizeRafRef.current = requestAnimationFrame(() => {
        updateCols(entry.contentRect.width);
        resizeRafRef.current = null;
      });
    });

    observer.observe(gridEl);
    return () => {
      observer.disconnect();
      if (resizeRafRef.current !== null) cancelAnimationFrame(resizeRafRef.current);
      resizeRafRef.current = null;
    };
  }, [filtersOpen]);

  const handleOpenDetails = useCallback(
    (card: ProfileCardResponse) => {
      captureScroll();
      setSelectedPublicSlug(card.publicSlug);
      setDetailsOpen(true);
    },
    [captureScroll]
  );

  const handleCloseDetails = useCallback(() => {
    setDetailsOpen(false);
    setSelectedPublicSlug(null);
  }, []);

  const showInitialSkeletons = items.length === 0 && isLoading && !isError;
  const showEmptyState = !isLoading && !isError && items.length === 0;

  const gridItems = items;
  const activeFilterCount = useMemo(
    () => getTalentFilterCounts(filtersOpen ? desktopDraftFilters : filters, skillsRaw).totalCount,
    [desktopDraftFilters, filters, filtersOpen, skillsRaw]
  );

  return (
    <section className="w-full h-full min-h-0 bg-(--color-secondary-white)">
      <div className="h-full w-full flex flex-col">
        <div className="flex-1 min-h-0 w-full min-w-0 flex flex-col gap-6 overflow-visible lg:flex-row lg:gap-0 lg:overflow-visible">
          <div className="min-w-0 flex-1 h-full flex flex-col lg:px-[40px] lg:py-[24px]">
            <div className="w-full max-w-[1500px] mx-auto flex-1 min-h-0 h-full">
              <article className="lg:hidden flex items-center justify-between shrink-0 mb-4">
                <h2 className="text-2xl font-semibold">{t('talent.page.title')}</h2>
                <FilterToggleButton
                  size="mobile"
                  count={getTalentFilterCounts(filters, skillsRaw).totalCount}
                  onClick={() => setMobileOpen(true)}
                  ariaLabel={t('general.filters.open')}
                />
              </article>

              <div className="hidden w-full lg:flex flex-row items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-(--color-primary-black) leading-tight">
                  {t('talent.page.title')}
                </h2>
                <FilterToggleButton
                  open={filtersOpen}
                  count={activeFilterCount}
                  onClick={() => setFiltersOpen((v) => !v)}
                  ariaLabel={filtersOpen ? t('general.filter.hide') : t('general.filter.show')}
                  ariaPressed={filtersOpen}
                />
              </div>

              {isError ? (
                <FetchErrorState className="py-18 text-center" />
              ) : (
                <>
                  <article
                    ref={cardsGridRef}
                    className="grid gap-4 items-stretch"
                    style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
                  >
                    {showInitialSkeletons &&
                      Array.from({ length: pageSize }).map((_, i) => (
                        <div key={`skeleton-${i}`} className="w-full">
                          <Skeleton className="w-full h-[400px] rounded-xl" />
                        </div>
                      ))}

                    {gridItems.map((it) => (
                      <div key={it.id} className="w-full">
                        <TalentCard item={it} onClick={isDesktop ? () => handleOpenDetails(it) : undefined} />
                      </div>
                    ))}

                    <div ref={sentinelRef} aria-hidden="true" className="h-px w-full col-span-full" />
                  </article>

                  {showEmptyState && (
                    <p className="py-18 text-center font-light text-(--color-secondary-grey)">
                      {t('state.no_results')}
                    </p>
                  )}
                  {items.length > 0 && isFetchingNextPage && (
                    <p className="py-10 text-center font-light text-(--color-secondary-grey)" aria-live="polite">
                      {t('state.loading')}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <TalentMobileFilterDrawer
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
                setDesktopDraftFilters({} as TalentFiltersQS);
                desktopDraftFiltersRef.current = {} as TalentFiltersQS;
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
          <TalentFilterBar
            value={desktopDraftFilters}
            onChange={(next) => {
              desktopDraftFiltersRef.current = next;
              setDesktopDraftFilters(next);
            }}
            onClose={() => setFiltersOpen(false)}
          />
        </FiltersDrawerShell>

        {isDesktop && (
          <PublicProfileDetailsView open={detailsOpen} onClose={handleCloseDetails} publicSlug={selectedPublicSlug} />
        )}
      </div>
    </section>
  );
}
