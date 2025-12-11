import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '../../../shared/components/Icon/Icon';
import { useDebouncedValue } from '../../../shared/hooks/useDebounceValue';
import { LG_SCREEN_SIZE, useMedia } from '../../../shared/hooks/useMedia';
import { useScrollExitOnEdge } from '../../../shared/hooks/useScrollExitOnEdge';
import { useViewportVhVar } from '../../../shared/hooks/useViewportVhVar';
import { PublicProfileDetailsView } from '../../public-profile/pages';
import { getPublicProfile } from '../../public-profile/services/publicProfileService';
import type { TalentPublicProfileResponse } from '../../talent/talent-profile-edit/types/talentProfile.types';
import { MobileFiltersDrawer, TalentCard, TalentFilterBar } from '../components';
import { getTalentDatabase } from '../services/talentDatabaseService';
import type { ProfileCardResponse, TalentFiltersQS } from '../types/talent-database.types';

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

const MAX_AUTOFILL_PAGES = 6;
const SCROLL_EPS = 8;

export default function TalentDatabasePage() {
  useViewportVhVar();
  const { t } = useTranslation(undefined, { useSuspense: false });
  const isDesktop = useMedia(LG_SCREEN_SIZE);
  const pageSize = isDesktop ? 6 : 3;

  const [filters, setFilters] = useState<TalentFiltersQS>(initialFilters);
  const debouncedFilters = useDebouncedValue(filters, 350);

  const firstRenderRef = useRef(true);
  useEffect(() => {
    firstRenderRef.current = false;
  }, []);
  const effectiveFilters = firstRenderRef.current ? filters : debouncedFilters;

  const [items, setItems] = useState<ProfileCardResponse[]>([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<TalentPublicProfileResponse | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const inflightRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);
  const fetchingNextRef = useRef(false);

  const cardsScrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const scrollRootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    scrollRootRef.current = (document.scrollingElement || document.documentElement) as HTMLElement;
  }, []);

  // ⬇️ IMPORTANTE: no forwardeamos al mismo elemento en desktop
  useScrollExitOnEdge(cardsScrollRef, {
    forwardTo: isDesktop ? cardsScrollRef : scrollRootRef,
  });

  const fetchPage = useCallback(
    async (p: number, replace = false) => {
      if (fetchingNextRef.current) return;
      fetchingNextRef.current = true;
      setLoading(true);
      if (replace) setError(null);

      const thisReqId = ++requestIdRef.current;
      const ctrl = new AbortController();
      inflightRef.current = ctrl;

      try {
        const res = await getTalentDatabase(p, pageSize, effectiveFilters, { signal: ctrl.signal });
        if (requestIdRef.current !== thisReqId) return;

        const fresh = res.items ?? [];
        setItems((prev) => (replace ? fresh : [...prev, ...fresh]));
        setPage(res.page + 1);
        setHasNext(!!res.hasNext);
      } catch (e: any) {
        if (e?.name === 'AbortError' || e?.name === 'CanceledError') {
          // ignoramos cancelaciones
        } else {
          setError('fetch_error');
          setHasNext(false);
        }
      } finally {
        if (inflightRef.current === ctrl) inflightRef.current = null;
        fetchingNextRef.current = false;
        setLoading(false);
      }
    },
    [effectiveFilters, pageSize]
  );

  useEffect(() => {
    cardsScrollRef.current?.scrollTo({ top: 0 });
    inflightRef.current?.abort();
    inflightRef.current = null;
    setItems([]);
    setPage(0);
    setHasNext(true);
    setError(null);
    fetchPage(0, true);
  }, [effectiveFilters, pageSize, fetchPage]);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem('talentFiltersOpen');
    return saved ? saved === '1' : true;
  });

  useEffect(() => {
    localStorage.setItem('talentFiltersOpen', filtersOpen ? '1' : '0');
  }, [filtersOpen]);

  useEffect(() => {
    const root = cardsScrollRef.current;
    const target = sentinelRef.current;
    if (!root || !target) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting) return;
        if (!hasNext || loading || fetchingNextRef.current || error) return;
        fetchPage(page, false);
      },
      { root, rootMargin: '600px 0px 800px 0px', threshold: 0 }
    );

    io.observe(target);
    return () => io.disconnect();
  }, [hasNext, loading, page, fetchPage, error]);

  useEffect(() => {
    const box = cardsScrollRef.current;
    if (!box || error) return;

    let cancelled = false;
    (async () => {
      let tries = 0;
      if (items.length === 0 && loading) return;

      while (!cancelled && hasNext && box.scrollHeight <= box.clientHeight + SCROLL_EPS && tries < MAX_AUTOFILL_PAGES) {
        tries += 1;
        await fetchPage(page, false);
        await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [items.length, hasNext, loading, fetchPage, page, error]);

  useEffect(() => {
    const onVis = () => {
      if (document.hidden || error) return;
      inflightRef.current?.abort();
      setItems([]);
      setPage(0);
      setHasNext(true);
      setError(null);
      fetchPage(0, true);
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [fetchPage, error]);

  const handleOpenDetails = useCallback(async (card: ProfileCardResponse) => {
    try {
      // Usa tu servicio real que devuelve TalentPublicProfileResponse
      const full = await getPublicProfile(card.publicSlug);
      setSelectedProfile(full);
      setDetailsOpen(true);
    } catch (e) {
      console.error('Error loading profile details', e);
    }
  }, []);

  const showInitialSkeletons = items.length === 0 && loading && !error;
  const showEmptyState = !loading && !error && items.length === 0;
  const isFetchingNextPage = items.length > 0 && loading;

  const gridItems = useMemo(() => items, [items]);

  return (
    <section className="w-full h-full min-h-0 bg-[var(--color-secondary-white)]">
      <div className="h-full w-full flex flex-col">
        {/* Mobile Filter Icon */}
        <article className="lg:hidden flex items-center justify-between mb-3 shrink-0 p-5">
          <h2 className="text-2xl font-semibold">{t('talent.page.title')}</h2>
          <button
            type="button"
            className="cursor-pointer inline-flex items-center gap-3 shadow-sm rounded-xl"
            onClick={() => setMobileOpen(true)}
            aria-label={t('general.filters.open')}
          >
            <span className="w-12 h-12 flex items-center justify-center bg-[var(--color-primary-white)] rounded-lg">
              <Icon name="filter" variant="primary" size={20} />
            </span>
          </button>
        </article>

        {/* Filter Bar */}
        <div className="flex-1 min-h-0 w-full min-w-0 flex flex-col lg:flex-row gap-6 overflow-hidden">
          {isDesktop && filtersOpen && (
            <aside className="hidden lg:flex lg:flex-col lg:w-[330px] h-full bg-[var(--color-primary-white)] border-r border-[var(--color-secondary-outline)]">
              <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-5">
                <TalentFilterBar value={filters} onChange={setFilters} onReset={() => setFilters(initialFilters)} />
              </div>
            </aside>
          )}

          {/* Content */}
          <div
            ref={cardsScrollRef}
            className="py-4 px-6 lg:py-8 w-full max-w-[1500px] m-auto flex-1 min-h-0 h-full overflow-auto overscroll-contain scrollbar-hide [-webkit-overflow-scrolling:touch]"
          >
            <div className="hidden w-full lg:flex flex-row items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">{t('talent.page.title')}</h2>
              <button
                type="button"
                className="cursor-pointer inline-flex items-center gap-3"
                onClick={() => setFiltersOpen((v) => !v)}
                aria-pressed={filtersOpen}
              >
                <h2 className="text-sm font-light underline">
                  {filtersOpen ? t('general.filter.hide') : t('general.filter.show')}
                </h2>
                <span className="w-12 h-12 flex items-center justify-center bg-[var(--color-primary-white)] rounded-lg">
                  <Icon name="filter" variant="primary" size={18} />
                </span>
              </button>
            </div>

            {error ? (
              <p className="py-18 text-center font-normal text-[var(--color-alert-error)]">{t('state.server_err')}</p>
            ) : (
              <>
                <article
                  className="
                    grid gap-6 place-items-stretch
                    grid-cols-[repeat(auto-fit,minmax(280px,1fr))]
                    sm:auto-rows-[408px]
                    lg:auto-rows-auto
                  "
                >
                  {showInitialSkeletons &&
                    Array.from({ length: pageSize }).map((_, i) => (
                      <div key={`skeleton-${i}`} className="w-full h-full">
                        <div className="animate-pulse w-full h-full bg-neutral-100 rounded-lg" />
                      </div>
                    ))}

                  {gridItems.map((it) => (
                    <div key={it.id} className="w-full h-full">
                      <TalentCard item={it} onClick={isDesktop ? () => handleOpenDetails(it) : undefined} />{' '}
                    </div>
                  ))}

                  <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />
                </article>

                {showEmptyState && (
                  <p className="py-18 text-center font-light text-[var(--color-secondary-grey)]">
                    {t('state.no_results')}
                  </p>
                )}
                {isFetchingNextPage && (
                  <p className="py-10 text-center font-light text-[var(--color-secondary-grey)]" aria-live="polite">
                    {t('state.loading')}
                  </p>
                )}
                {!hasNext && gridItems.length > 0 && (
                  <p className="py-18 text-center font-light text-[var(--color-secondary-grey)]" aria-live="polite">
                    {t('state.no_more_results')}
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        <MobileFiltersDrawer
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          value={filters}
          onReset={() => setFilters(initialFilters)}
          onApply={(next) => setFilters(next)}
        />

        {isDesktop && (
          <PublicProfileDetailsView
            open={detailsOpen && !!selectedProfile}
            onClose={() => {
              setDetailsOpen(false);
              setSelectedProfile(null);
            }}
            profile={selectedProfile ?? null}
          />
        )}
      </div>
    </section>
  );
}
