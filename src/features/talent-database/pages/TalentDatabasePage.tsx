import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebouncedValue } from '../../../shared/hooks/useDebounceValue';
import { LG_SCREEN_SIZE, useMedia } from '../../../shared/hooks/useMedia';
import { useScrollExitOnEdge } from '../../../shared/hooks/useScrollExitOnEdge';
import { useViewportVhVar } from '../../../shared/hooks/useViewportVhVar';
import filterIcon from '../../../shared/icons/filter.svg';
import { MobileFiltersDrawer, TalentCard } from '../components';
import { TalentFilterBar } from '../components/TalentFilterBar';
import { useTalentDatabase } from '../hooks/useTalentDatabase';
import type { TalentFiltersQS } from '../types/talent-database.types';

const initialFilters: TalentFiltersQS = {
  stageName: '',
  genderIds: ['NULL'],
  hairColorId: undefined,
  eyeColorId: undefined,
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
  const { t } = useTranslation();
  const isDesktop = useMedia(LG_SCREEN_SIZE);
  const pageSize = isDesktop ? 6 : 3;

  const [filters, setFilters] = useState<TalentFiltersQS>(initialFilters);
  const debouncedFilters = useDebouncedValue(filters, 350);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem('talentFiltersOpen');
    return saved ? saved === '1' : true;
  });

  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetched, fetchStatus } = useTalentDatabase(
    pageSize,
    debouncedFilters
  );

  const items = useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data]);

  const cardsScrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const fetchLockRef = useRef(false);
  const scrollRootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    scrollRootRef.current = (document.scrollingElement || document.documentElement) as HTMLElement;
  }, []);

  // Facilita el scroll entre contenedores (tu hook actual)
  useScrollExitOnEdge(cardsScrollRef, { forwardTo: isDesktop ? cardsScrollRef : scrollRootRef });

  // Reset al cambiar filtros / tamaño de página
  useEffect(() => {
    cardsScrollRef.current?.scrollTo({ top: 0 });
  }, [debouncedFilters, pageSize]);

  // Persistencia del toggle de filtros
  useEffect(() => {
    localStorage.setItem('talentFiltersOpen', filtersOpen ? '1' : '0');
  }, [filtersOpen]);

  // --------- INFINITE SCROLL: IntersectionObserver + rootMargin ----------
  useEffect(() => {
    const root = cardsScrollRef.current;
    const target = sentinelRef.current;
    if (!root || !target) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting) return;
        if (!hasNextPage || isFetchingNextPage || fetchLockRef.current) return;

        fetchLockRef.current = true;
        fetchNextPage().finally(() => {
          fetchLockRef.current = false;
        });
      },
      {
        root, // Observa dentro del contenedor scrolleable
        rootMargin: '600px 0px 800px 0px', // prefetch antes de llegar al final
        threshold: 0,
      }
    );

    io.observe(target);
    return () => io.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // --------- AUTO-FILL INICIAL: rellena hasta que haya scroll o no haya más páginas ----------
  useEffect(() => {
    const box = cardsScrollRef.current;
    if (!box) return;

    let cancelled = false;

    (async () => {
      // Si aún no hay ítems y el estado está en "fetching",
      // dejamos que la primera llamada complete antes de bombear.
      if (items.length === 0 && fetchStatus === 'fetching') return;

      let tries = 0;
      while (
        !cancelled &&
        hasNextPage &&
        tries < MAX_AUTOFILL_PAGES &&
        box.scrollHeight <= box.clientHeight + SCROLL_EPS
      ) {
        tries += 1;
        await fetchNextPage();
        // esperar al layout
        await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [debouncedFilters, pageSize, hasNextPage, fetchNextPage, fetchStatus, items.length]);

  // --------- ResizeObserver: si el contenedor cambia de tamaño y se queda corto, trae más ----------
  useEffect(() => {
    const el = cardsScrollRef.current;
    if (!el) return;

    let resizeTimer: number | null = null;
    const ro = new ResizeObserver(() => {
      if (resizeTimer) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (!hasNextPage || isFetchingNextPage) return;
        const hasScroll = el.scrollHeight > el.clientHeight + SCROLL_EPS;
        if (!hasScroll) {
          fetchNextPage();
        }
      }, 100);
    });

    ro.observe(el);
    return () => {
      ro.disconnect();
      if (resizeTimer) window.clearTimeout(resizeTimer);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // --------- estados visuales ----------
  const showInitialSkeletons = fetchStatus === 'fetching' && items.length === 0;
  const showEmptyState = isFetched && !error && items.length === 0;

  return (
    <section className="w-full h-full min-h-0 flex flex-col">
      {/* Header mobile */}
      <article className="lg:hidden flex items-center justify-between mb-3 shrink-0">
        <h2 className="text-2xl font-semibold">{t('talent.page.title')}</h2>

        <button
          type="button"
          className="cursor-pointer inline-flex items-center gap-3"
          onClick={() => setMobileOpen(true)}
          aria-label={t('talent.filters.open')}
        >
          <h2 className="text-base font-semibold">{t('talent.filter.title')}</h2>
          <span className="w-10 h-10 flex items-center justify-center bg-[var(--color-primary-light-grey)] rounded-lg">
            <img src={filterIcon} alt="Filter bar" className="w-5 h-5" />
          </span>
        </button>
      </article>

      <div className="flex-1 min-h-0 w-full min-w-0 flex flex-col lg:flex-row gap-6 overflow-hidden">
        {/* Filters */}
        {isDesktop && filtersOpen && (
          <aside className="hidden lg:flex lg:flex-col lg:w-[300px] min-h-0 overflow-hidden">
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain pr-4">
              <TalentFilterBar value={filters} onChange={setFilters} onReset={() => setFilters(initialFilters)} />
            </div>
          </aside>
        )}

        {/* Cards (scroller) */}
        <div
          ref={cardsScrollRef}
          className="flex-1 min-h-0 w-full overflow-auto overscroll-contain scrollbar-hide [-webkit-overflow-scrolling:touch]"
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
                {filtersOpen ? t('talent.filter.hide') : t('talent.filter.show')}
              </h2>
              <span className="w-10 h-10 flex items-center justify-center bg-[var(--color-primary-light-grey)] rounded-lg">
                <img src={filterIcon} alt="Filter bar" className="w-5 h-5" />
              </span>
            </button>
          </div>

          {error && (
            <p className="py-18 text-center font-normal text-[var(--color-alert-error)]">{t('state.server_err')}</p>
          )}

          {!error && (
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

              {items.map((it) => (
                <div key={it.id} className="w-full h-full">
                  <TalentCard item={it} />
                </div>
              ))}

              {/* Sentinel para el IO: siempre al final */}
              <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />
            </article>
          )}

          {/* Estados inferiores (si hay pocos resultados también se ven) */}
          {showEmptyState && (
            <p className="py-18 text-center font-light text-[var(--color-secondary-grey)]">{t('state.no_results')}</p>
          )}

          {isFetchingNextPage && items.length > 0 && (
            <p className="py-10 text-center font-light text-[var(--color-secondary-grey)]" aria-live="polite">
              {t('state.loading')}
            </p>
          )}

          {!hasNextPage && items.length > 0 && (
            <p className="py-18 text-center font-light text-[var(--color-secondary-grey)]" aria-live="polite">
              {t('state.no_more_results')}
            </p>
          )}
        </div>
      </div>

      {/* Filtros móviles */}
      <MobileFiltersDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        value={filters}
        onReset={() => setFilters(initialFilters)}
        onApply={(next) => setFilters(next)}
      />
    </section>
  );
}
