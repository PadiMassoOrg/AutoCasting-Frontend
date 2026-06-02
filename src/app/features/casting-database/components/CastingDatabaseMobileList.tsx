import { Skeleton } from 'autocasting-ui-library-padimasso';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../shared/lib/routes';
import FilterToggleButton from '../../../shared/components/FilterToggleButton/FilterToggleButton';
import { getCastingDatabase } from '../services/castingDatabaseService';
import type { CastingFiltersQS, CastingRolePublicCardResponse } from '../types/casting-database.types';
import CastingRolePublicCard from './CastingRolePublicCard';

const MOBILE_PAGE_SIZE = 5;
const MAX_AUTOFILL_PAGES = 6;
const SCROLL_EPS = 8;

type Props = {
  filters: CastingFiltersQS;
  activeFilterCount: number;
  onOpenFilters: () => void;
};

export default function CastingDatabaseMobileList({ filters, activeFilterCount, onOpenFilters }: Props) {
  const { t } = useTranslation(undefined, { useSuspense: false });
  const navigate = useNavigate();

  const [items, setItems] = useState<CastingRolePublicCardResponse[]>([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inflightRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);
  const fetchingNextRef = useRef(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const fetchPage = useCallback(
    async (nextPage: number, replace = false) => {
      if (fetchingNextRef.current) return;
      fetchingNextRef.current = true;
      setLoading(true);
      if (replace) setError(null);

      const requestId = ++requestIdRef.current;
      const ctrl = new AbortController();
      inflightRef.current = ctrl;

      try {
        const response = await getCastingDatabase(nextPage, MOBILE_PAGE_SIZE, filters, { signal: ctrl.signal });
        if (requestIdRef.current !== requestId) return;

        const freshItems = response.items ?? [];
        setItems((prev) => (replace ? freshItems : [...prev, ...freshItems]));
        setPage(response.page + 1);
        setHasNext(Boolean(response.hasNext));
      } catch (currentError: any) {
        if (currentError?.name !== 'AbortError' && currentError?.name !== 'CanceledError') {
          setError('fetch_error');
          setHasNext(false);
        }
      } finally {
        if (inflightRef.current === ctrl) inflightRef.current = null;
        fetchingNextRef.current = false;
        setLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'auto' });
    inflightRef.current?.abort();
    inflightRef.current = null;
    setItems([]);
    setPage(0);
    setHasNext(true);
    setError(null);
    fetchPage(0, true);
  }, [fetchPage]);

  useEffect(() => {
    const target = sentinelRef.current;
    const root = scrollContainerRef.current;
    if (!target || !root) return;

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
  }, [error, fetchPage, hasNext, loading, page]);

  useEffect(() => {
    if (error) return;

    let cancelled = false;
    (async () => {
      let tries = 0;
      if (items.length === 0 && loading) return;

      const root = scrollContainerRef.current;
      if (!root) return;
      while (
        !cancelled &&
        hasNext &&
        root.scrollHeight <= root.clientHeight + SCROLL_EPS &&
        tries < MAX_AUTOFILL_PAGES
      ) {
        tries += 1;
        await fetchPage(page, false);
        await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [error, fetchPage, hasNext, items.length, loading, page]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden || error) return;
      inflightRef.current?.abort();
      setItems([]);
      setPage(0);
      setHasNext(true);
      setError(null);
      fetchPage(0, true);
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [error, fetchPage]);

  const showInitialSkeletons = items.length === 0 && loading && !error;
  const showEmptyState = !loading && !error && items.length === 0;
  const isFetchingNextPage = items.length > 0 && loading;

  return (
    <div
      ref={scrollContainerRef}
      className="scrollbar-hide flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain"
    >
      <article className="flex items-center justify-between shrink-0 py-2">
        <h2 className="text-2xl font-semibold">{t('casting-database.page.title')}</h2>
        <FilterToggleButton
          size="mobile"
          count={activeFilterCount}
          onClick={onOpenFilters}
          ariaLabel={t('general.filters.open')}
        />
      </article>

      {error ? (
        <p className="py-18 text-center font-normal text-(--color-alert-error)">{t('state.server_err')}</p>
      ) : (
        <>
          <article className="flex flex-col gap-6">
            {showInitialSkeletons &&
              Array.from({ length: MOBILE_PAGE_SIZE }).map((_, index) => (
                <div key={`casting-skeleton-${index}`} className="w-full">
                  <Skeleton className="w-full h-[228px] rounded-xl" />
                </div>
              ))}

            {items.map((item) => (
              <div key={item.id} className="w-full">
                <CastingRolePublicCard
                  item={item}
                  onSelect={(current) =>
                    navigate(`${ROUTES.PUBLIC_CASTING}/${current.defaultCode}/roles/${current.id}`)
                  }
                />
              </div>
            ))}

            <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />
          </article>

          {showEmptyState ? (
            <p className="py-18 text-center font-light text-(--color-secondary-grey)">{t('state.no_results')}</p>
          ) : null}
          {isFetchingNextPage ? (
            <p className="py-10 text-center font-light text-(--color-secondary-grey)" aria-live="polite">
              {t('state.loading')}
            </p>
          ) : null}
        </>
      )}
    </div>
  );
}
