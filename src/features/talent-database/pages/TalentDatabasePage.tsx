import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LG_SCREEN_SIZE, useMedia } from '../../../shared/hooks/useMedia';

import { MobileFiltersDrawer, TalentCard } from '../components';
import { TalentFilterBar } from '../components/TalentFilterBar';
import { useTalentDatabase } from '../hooks/useTalentDatabase';
import type { TalentFiltersQS } from '../types/talent-database.types';

const initialFilters: TalentFiltersQS = {
  stageName: '',
  genderId: undefined,
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
  const { t } = useTranslation();
  const isDesktop = useMedia(LG_SCREEN_SIZE);
  const pageSize = isDesktop ? 6 : 3;

  const [filters, setFilters] = useState<TalentFiltersQS>(initialFilters);
  const [mobileOpen, setMobileOpen] = useState(false);

  // fetch con tamaño según breakpoint
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useTalentDatabase(
    pageSize,
    filters
  );

  const items = useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data]);

  // contador simple de filtros activos (para badge del botón)
  const selectedCount = useMemo(() => {
    const isSet = (x: unknown) => x !== undefined && x !== '' && !(Array.isArray(x) && x.length === 0);
    const singles = [
      filters.stageName,
      filters.genderId,
      filters.hairColorId,
      filters.eyeColorId,
      filters.ageMin,
      filters.ageMax,
      filters.heightMinCm,
      filters.heightMaxCm,
      filters.tattoo,
      filters.passport,
      filters.drivingLicense,
    ].filter(isSet).length;
    const lists = (filters.professionId?.length ?? 0) + (filters.skillId?.length ?? 0);
    return singles + (lists > 0 ? 1 : 0);
  }, [filters]);

  // contenedor scrollable y sentinel
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // reset scroll al cambiar filtros o pageSize (no refresca toda la página)
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [filters, pageSize]);

  // IntersectionObserver dentro del contenedor
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
      {/* Header: título + botón Filtros (solo mobile) */}
      <article className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{t('talent.page.title')}</h2>

        <button
          type="button"
          className="lg:hidden inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm bg-white"
          onClick={() => setMobileOpen(true)}
          aria-label={t('filters.open', 'Abrir filtros')}
        >
          {/* icono slider */}
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
            <path d="M3 6h18M6 12h12M10 18h4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
          {t('filters.title', 'Filtros')}
          {selectedCount > 0 && <span className="ml-1 rounded-full border px-2 py-0.5 text-xs">{selectedCount}</span>}
        </button>
      </article>

      <div className="w-full min-w-0 flex flex-col lg:flex-row gap-6">
        {/* Sidebar filtros Desktop */}
        <aside className="hidden lg:block min-h-0">
          <TalentFilterBar value={filters} onChange={setFilters} />
        </aside>

        {/* Contenedor scrollable de cards (solo esto se refresca) */}
        <div ref={scrollRef} className="w-full overflow-auto rounded-xl bg-white/50 p-3 h-[70vh] lg:h-[75vh] border">
          <article className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(280px,1fr))] auto-rows-auto sm:auto-rows-[408px]">
            {items.map((it) => (
              <div key={it.id} className="w-full h-full">
                <TalentCard item={it} />
              </div>
            ))}
            {/* Sentinel al final del grid */}
            <div ref={sentinelRef} className="col-span-full h-1" />
          </article>

          {isFetchingNextPage && <p className="py-3 text-center text-neutral-500">Cargando más…</p>}
          {!hasNextPage && items.length > 0 && (
            <p className="py-6 text-center text-neutral-400">No hay más resultados</p>
          )}
        </div>
      </div>

      <MobileFiltersDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        value={filters}
        onReset={() => setFilters(initialFilters)}
      />
    </section>
  );
}
