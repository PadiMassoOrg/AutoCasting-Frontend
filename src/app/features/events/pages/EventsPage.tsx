import { LG_SCREEN_SIZE, Skeleton, useMedia, useViewportVhVar } from 'autocasting-ui-library-padimasso';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FetchErrorState } from '../../../shared/components/FetchErrorState';
import FilterToggleButton from '../../../shared/components/FilterToggleButton/FilterToggleButton';
import { LoadMoreSentinel } from '../../../shared/components/LoadMoreSentinel';
import { EventCard, EventsFiltersDrawer } from '../components';
import { useEventsInfinite } from '../hooks/useEventsInfinite';
import type { EventCardResponse, EventFiltersQS } from '../types/events.types';
import { countActiveEventFilters } from '../utils/eventsFilterKey';

const initialFilters: EventFiltersQS = {};

export default function EventsPage() {
  useViewportVhVar();
  const { t } = useTranslation(undefined, { useSuspense: false });
  const isDesktop = useMedia(LG_SCREEN_SIZE);
  const pageSize = isDesktop ? 9 : 6;

  const [filters, setFilters] = useState<EventFiltersQS>(initialFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useEventsInfinite({
    pageSize,
    filters,
  });

  const items = useMemo<EventCardResponse[]>(
    () => (data?.pages ?? []).flatMap((slice) => slice.items ?? []),
    [data?.pages]
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [filters, pageSize]);

  const showInitialSkeletons = items.length === 0 && isLoading && !isError;
  const showEmptyState = !isLoading && !isError && items.length === 0;
  const activeFilterCount = countActiveEventFilters(filters);

  return (
    <section className="w-full h-full min-h-0 bg-(--color-secondary-white)">
      <div className="h-full w-full flex flex-col">
        <div className="min-w-0 flex-1 h-full flex flex-col lg:px-[40px] lg:py-[24px]">
          <div className="w-full max-w-[1500px] mx-auto flex-1 min-h-0 h-full">
            <div className="flex w-full items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-(--color-primary-black) leading-tight">
                {t('events.page.title')}
              </h2>
              <FilterToggleButton
                size={isDesktop ? 'desktop' : 'mobile'}
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
                <article className="grid grid-cols-1 gap-4 items-stretch md:grid-cols-2 xl:grid-cols-3">
                  {showInitialSkeletons &&
                    Array.from({ length: pageSize }).map((_, i) => (
                      <Skeleton key={`skeleton-${i}`} className="w-full h-[140px] rounded-xl" />
                    ))}

                  {items.map((item) => (
                    <EventCard key={item.id} item={item} />
                  ))}
                </article>

                <LoadMoreSentinel
                  enabled={!!hasNextPage && !isFetchingNextPage}
                  onVisible={() => void fetchNextPage()}
                />

                {showEmptyState && (
                  <p className="py-18 text-center font-light text-(--color-secondary-grey)">{t('state.no_results')}</p>
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

        <EventsFiltersDrawer
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          variant={isDesktop ? 'desktop' : 'mobile'}
          value={filters}
          onReset={() => setFilters(initialFilters)}
          onApply={(next) => setFilters(next)}
        />
      </div>
    </section>
  );
}
