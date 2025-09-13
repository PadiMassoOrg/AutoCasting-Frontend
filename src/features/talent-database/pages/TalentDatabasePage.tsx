'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LG_SCREEN_SIZE, useMedia } from '../../../shared/hooks/useMedia';
import { TalentCard } from '../components/TalentCard';
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

const TalentDatabasePage = () => {
  const { t } = useTranslation();
  const isDesktop = useMedia(LG_SCREEN_SIZE);
  const pageSize = isDesktop ? 6 : 3; // ← mobile 3, desktop 6

  const [filters, setFilters] = useState<TalentFiltersQS>(initialFilters);

  // fetch con tamaño según breakpoint
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useTalentDatabase(
    pageSize,
    filters
  );

  const items = useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data]);

  // contenedor scrollable y sentinel
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // reset scroll al cambiar filtros o pageSize
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [filters, pageSize]);

  // IntersectionObserver dentro del contenedor (no en body)
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
      {
        root: rootEl, // ← observar dentro del contenedor
        rootMargin: '400px 0px', // prefetch antes de llegar al fondo
        threshold: 0,
      }
    );

    io.observe(sentinelEl);
    console.log(isFetchingNextPage);
    return () => io.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, items.length, filters, pageSize]);

  if (isLoading) return <p>Cargando catálogo…</p>;
  if (error || !data) return <p>Error al cargar el catálogo</p>;

  return (
    <section className="flex flex-col gap-5">
      <article className="flex flex-row items-center justify-between">
        <h2 className="text-2xl font-semibold">{t('talent.page.title')}</h2>
      </article>

      <div className="w-full min-w-0 flex flex-col lg:flex-row gap-6">
        {/* Filter bar a la izquierda (desktop) */}
        <aside className="hidden lg:block">
          <TalentFilterBar value={filters} onChange={setFilters} onReset={() => setFilters(initialFilters)} />
        </aside>

        {/* Contenedor scrollable de cards */}
        <div
          ref={scrollRef}
          className="
            w-full overflow-auto rounded-xl
            bg-white/50
            p-3
            h-[70vh] lg:h-[75vh]      /* altura fija -> no crece el body */
            border
          "
        >
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
    </section>
  );
};

export default TalentDatabasePage;
