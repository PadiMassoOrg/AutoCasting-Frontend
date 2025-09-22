import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const debouncedFilters = useDebouncedValue(filters, 350);
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useTalentDatabase(
    pageSize,
    debouncedFilters
  );
  const items = useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data]);

  const cardsScrollRef = useRef<HTMLDivElement>(null);
  const fetchLockRef = useRef(false);
  const autofillAttemptsRef = useRef(0);
  const edgeOptions = useMemo(() => ({ forwardTo: isDesktop ? undefined : ('window' as const) }), [isDesktop]);
  useScrollExitOnEdge(cardsScrollRef, edgeOptions);

  useEffect(() => {
    cardsScrollRef.current?.scrollTo({ top: 0 });
    autofillAttemptsRef.current = 0;
  }, [debouncedFilters, pageSize]);

  const handleScroll = useCallback(() => {
    const el = cardsScrollRef.current;
    if (!el || !hasNextPage || isFetchingNextPage || fetchLockRef.current) return;

    const { scrollTop, clientHeight, scrollHeight } = el;
    const reached75 = scrollTop + clientHeight >= scrollHeight * 0.75;

    if (reached75) {
      fetchLockRef.current = true;
      fetchNextPage().finally(() => {
        fetchLockRef.current = false;
      });
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const el = cardsScrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const el = cardsScrollRef.current;
    if (!el) return;
    if (isLoading || isFetchingNextPage) return;

    const tryFill = () => {
      const box = cardsScrollRef.current;
      if (!box) return;

      const hasScroll = box.scrollHeight > box.clientHeight + SCROLL_EPS;
      if (hasScroll) {
        autofillAttemptsRef.current = 0;
        return;
      }

      if (!hasNextPage) {
        autofillAttemptsRef.current = 0;
        return;
      }
      if (autofillAttemptsRef.current >= MAX_AUTOFILL_PAGES) return;
      autofillAttemptsRef.current += 1;
      fetchNextPage().then(() => {
        requestAnimationFrame(() => setTimeout(tryFill, 0));
      });
    };
    tryFill();
  }, [items.length, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);

  useEffect(() => {
    const el = cardsScrollRef.current;
    if (!el) return;

    let resizeTimer: number | null = null;
    const ro = new ResizeObserver(() => {
      if (resizeTimer) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (isLoading || isFetchingNextPage) return;
        if (!hasNextPage) return;
        const box = cardsScrollRef.current;
        if (!box) return;
        const hasScroll = box.scrollHeight > box.clientHeight + SCROLL_EPS;
        if (!hasScroll) {
          autofillAttemptsRef.current = 0;
          fetchNextPage();
        }
      }, 80);
    });

    ro.observe(el);
    return () => {
      ro.disconnect();
      if (resizeTimer) window.clearTimeout(resizeTimer);
    };
  }, [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);

  const showInitialSkeletons = isLoading && (!data || items.length === 0);
  const showEmptyState = !isLoading && !error && items.length === 0;

  return (
    <section className="h-full min-h-0 flex flex-col">
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
        <aside className="hidden lg:flex lg:flex-col lg:w-[300px] min-h-0 overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain pr-4">
            <TalentFilterBar value={filters} onChange={setFilters} onReset={() => setFilters(initialFilters)} />
          </div>
        </aside>

        {/* Cards */}
        <div
          ref={cardsScrollRef}
          className="flex-1 min-h-0 w-full overflow-auto overscroll-contain scrollbar-hide [-webkit-overflow-scrolling:touch]"
        >
          <h2 className="hidden lg:block text-2xl font-semibold mb-6">{t('talent.page.title')}</h2>

          {error && <p className="py-6 text-center text-red-500">Error al cargar el catálogo</p>}

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
          </article>

          {showEmptyState && <p className="py-6 text-center text-neutral-400">No se encontraron resultados</p>}

          {isFetchingNextPage && <p className="py-3 text-center text-neutral-500">Cargando más…</p>}
          {!hasNextPage && items.length > 0 && (
            <p className="py-18 text-center text-neutral-400">No hay más resultados</p>
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
    </section>
  );
}
