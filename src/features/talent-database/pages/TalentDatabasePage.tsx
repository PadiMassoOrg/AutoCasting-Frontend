import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LG_SCREEN_SIZE, useMedia } from '../../../shared/hooks/useMedia';
import { useScrollExitOnEdge } from '../../../shared/hooks/useScrollExitOnEdge';
import { useViewportVhVar } from '../../../shared/hooks/useViewportVhVar';
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

export default function TalentDatabasePage() {
  useViewportVhVar();
  const { t } = useTranslation();
  const isDesktop = useMedia(LG_SCREEN_SIZE);
  const pageSize = isDesktop ? 6 : 3;

  const [filters, setFilters] = useState<TalentFiltersQS>(initialFilters);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useTalentDatabase(
    pageSize,
    filters
  );

  const items = useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data]);

  const selectedCount = useMemo(() => {
    const isSet = (x: unknown) => x !== undefined && x !== '' && !(Array.isArray(x) && x.length === 0);
    const genderActive = (filters.genderIds ?? []).some((id) => id !== 'NULL');
    const singles =
      [
        filters.stageName,
        filters.hairColorId,
        filters.eyeColorId,
        filters.ageMin,
        filters.ageMax,
        filters.heightMinCm,
        filters.heightMaxCm,
        filters.tattoo,
        filters.passport,
        filters.drivingLicense,
      ].filter(isSet).length + (genderActive ? 1 : 0);
    const lists = (filters.professionId?.length ?? 0) + (filters.skillId?.length ?? 0);
    const listsCount = lists > 0 ? 1 : 0;
    return singles + listsCount;
  }, [filters]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useScrollExitOnEdge(scrollRef);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [filters, pageSize]);

  useEffect(() => {
    const rootEl = scrollRef.current;
    const sentinelEl = sentinelRef.current;
    if (!rootEl || !sentinelEl) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root: rootEl, rootMargin: '400px 0px', threshold: 0 }
    );

    io.observe(sentinelEl);
    return () => io.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, items.length, filters, pageSize]);

  if (isLoading) return <p>Cargando catálogo…</p>;
  if (error || !data) return <p>Error al cargar el catálogo</p>;

  return (
    <section className="flex flex-col gap-5">
      <article className="flex items-center justify-between">
        {/* Header */}
        <h2 className="text-2xl font-semibold">{t('talent.page.title')}</h2>
        <button
          type="button"
          className="cursor-pointer lg:hidden inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm bg-white"
          onClick={() => setMobileOpen(true)}
          aria-label={t('talent.filters.open')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
            <path d="M3 6h18M6 12h12M10 18h4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
          {t('talent.filter.title')}
          {selectedCount > 0 && <span className="ml-1 rounded-full border px-2 py-0.5 text-xs">{selectedCount}</span>}
        </button>
      </article>

      <div className="w-full min-w-0 flex flex-col lg:flex-row gap-6">
        {/* Desktop Filters */}
        <aside className="hidden lg:block min-h-0">
          <TalentFilterBar value={filters} onChange={setFilters} />
        </aside>

        {/* Content */}
        <div
          ref={scrollRef}
          style={{ overscrollBehavior: 'auto' }}
          className="w-full overflow-auto h-[90vh] lg:h-[75vh] scrollbar-hide [-webkit-overflow-scrolling:touch]"
        >
          <article className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(280px,1fr))] auto-rows-auto sm:auto-rows-[408px]">
            {items.map((it) => (
              <div key={it.id} className="w-full h-full">
                <TalentCard item={it} />
              </div>
            ))}
            <div ref={sentinelRef} className="col-span-full h-1" />
          </article>
          {isFetchingNextPage && <p className="py-3 text-center text-neutral-500">Cargando más…</p>}
          {!hasNextPage && items.length > 0 && (
            <p className="py-6 text-center text-neutral-400">No hay más resultados</p>
          )}
        </div>
      </div>

      {/* Mobile Filters */}
      <MobileFiltersDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        value={filters}
        onReset={() => setFilters(initialFilters)}
        onApply={(next) => {
          setFilters(next);
        }}
      />
    </section>
  );
}
