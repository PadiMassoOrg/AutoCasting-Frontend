import { Icon, useDebouncedValue, useViewportVhVar } from 'autocasting-ui-library-padimasso';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LG_SCREEN_SIZE, useMedia } from '../../../shared/hooks/useMedia';
import { CastingFilterBar, CastingMobileFiltersDrawer, CastingRolePublicCard } from '../components';
import { getCastingDatabase } from '../services/castingDatabaseService';
import type { CastingFiltersQS, CastingRolePublicCardResponse } from '../types/casting-database.types';

const MAX_AUTOFILL_PAGES = 6;
const SCROLL_EPS = 8;

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
  const isDesktop = useMedia(LG_SCREEN_SIZE);
  const pageSize = isDesktop ? 6 : 3;

  const [filters, setFilters] = useState<CastingFiltersQS>(initialFilters);
  const debouncedFilters = useDebouncedValue(filters, 350);

  const firstRenderRef = useRef(true);
  useEffect(() => {
    firstRenderRef.current = false;
  }, []);
  const effectiveFilters = firstRenderRef.current ? filters : debouncedFilters;

  const [items, setItems] = useState<CastingRolePublicCardResponse[]>([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inflightRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);
  const fetchingNextRef = useRef(false);

  const sentinelRef = useRef<HTMLDivElement>(null);

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
        const res = await getCastingDatabase(p, pageSize, effectiveFilters, { signal: ctrl.signal });
        if (requestIdRef.current !== thisReqId) return;

        const fresh = res.items ?? [];
        setItems((prev) => (replace ? fresh : [...prev, ...fresh]));
        setPage(res.page + 1);
        setHasNext(!!res.hasNext);
      } catch (e: any) {
        if (e?.name === 'AbortError' || e?.name === 'CanceledError') {
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
    window.scrollTo({ top: 0, behavior: 'auto' });
    inflightRef.current?.abort();
    inflightRef.current = null;
    setItems([]);
    setPage(0);
    setHasNext(true);
    setError(null);
    fetchPage(0, true);
  }, [effectiveFilters, pageSize, fetchPage]);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);

  useEffect(() => {
    const target = sentinelRef.current;
    if (!target) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting) return;
        if (!hasNext || loading || fetchingNextRef.current || error) return;
        fetchPage(page, false);
      },
      { root: null, rootMargin: '600px 0px 800px 0px', threshold: 0 }
    );

    io.observe(target);
    return () => io.disconnect();
  }, [hasNext, loading, page, fetchPage, error]);

  useEffect(() => {
    if (error) return;

    let cancelled = false;
    (async () => {
      let tries = 0;
      if (items.length === 0 && loading) return;

      const root = (document.scrollingElement || document.documentElement) as HTMLElement;
      while (
        !cancelled &&
        hasNext &&
        root.scrollHeight <= root.clientHeight + SCROLL_EPS &&
        tries < MAX_AUTOFILL_PAGES
      ) {
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

  const showInitialSkeletons = items.length === 0 && loading && !error;
  const showEmptyState = !loading && !error && items.length === 0;
  const isFetchingNextPage = items.length > 0 && loading;

  return (
    <section className="w-full h-full min-h-0 bg-(--color-secondary-white)">
      <div className="h-full w-full flex flex-col">
        <div className="flex-1 min-h-0 w-full min-w-0 flex flex-col gap-6 overflow-hidden lg:flex-row lg:gap-0">
          {isDesktop && filtersOpen && (
            <aside className="hidden lg:flex lg:flex-col lg:w-[330px] h-full bg-(--color-primary-white) border-r border-(--color-secondary-outline)">
              <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-5">
                <CastingFilterBar value={filters} onChange={setFilters} onReset={() => setFilters(initialFilters)} />
              </div>
            </aside>
          )}

          <div className="min-w-0 flex-1 h-full flex flex-col lg:px-[56px] lg:py-[56px]">
            <div className="w-full max-w-[1500px] mx-auto flex-1 min-h-0 h-full">
              <article className="lg:hidden flex items-center justify-between shrink-0 py-2">
                <h2 className="text-2xl font-semibold">{t('casting-database.page.title')}</h2>
                <button
                  type="button"
                  className="cursor-pointer inline-flex items-center gap-3 shadow-sm rounded-xl"
                  onClick={() => setMobileOpen(true)}
                  aria-label={t('general.filters.open')}
                >
                  <span className="w-12 h-12 flex items-center justify-center bg-(--color-primary-white) rounded-lg">
                    <Icon name="filter" variant="primary" size={20} />
                  </span>
                </button>
              </article>

              <div className="hidden w-full lg:flex flex-row items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">{t('casting-database.page.title')}</h2>
                <button
                  type="button"
                  className="cursor-pointer inline-flex items-center gap-3"
                  onClick={() => setFiltersOpen((v) => !v)}
                  aria-pressed={filtersOpen}
                >
                  <h2 className="text-sm font-light hover:text-(--color-primary-purple)">
                    {filtersOpen ? t('general.filter.hide') : t('general.filter.show')}
                  </h2>
                  <span className="w-11 h-11 flex items-center justify-center bg-(--color-primary-white) rounded-lg">
                    <Icon name="filter" variant="primary" />
                  </span>
                </button>
              </div>

              {error ? (
                <p className="py-18 text-center font-normal text-(--color-alert-error)">{t('state.server_err')}</p>
              ) : (
                <>
                  <article className="flex flex-col gap-10">
                    {showInitialSkeletons &&
                      Array.from({ length: pageSize }).map((_, i) => (
                        <div key={`casting-skeleton-${i}`} className="w-full">
                          <div className="animate-pulse w-full h-40 bg-neutral-100 rounded-lg" />
                        </div>
                      ))}

                    {items.map((it) => (
                      <div key={it.id} className="w-full">
                        <CastingRolePublicCard item={it} />
                      </div>
                    ))}

                    <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />
                  </article>

                  {showEmptyState && (
                    <p className="py-18 text-center font-light text-(--color-secondary-grey)">
                      {t('state.no_results')}
                    </p>
                  )}
                  {isFetchingNextPage && (
                    <p className="py-10 text-center font-light text-(--color-secondary-grey)" aria-live="polite">
                      {t('state.loading')}
                    </p>
                  )}
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
