import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '../../../shared/components/Icon/Icon';
import { LG_SCREEN_SIZE, useMedia } from '../../../shared/hooks/useMedia';
import { useViewportVhVar } from '../../../shared/hooks/useViewportVhVar';
import { CastingRolePublicCard } from '../components';
import { CASTING_ROLE_PUBLIC_CARDS_MOCK } from '../mock/casting-card-mock';
import type { CastingRolePublicCardResponse } from '../types/casting-database.types';

const CastingDatabasePage = () => {
  useViewportVhVar();
  const { t } = useTranslation(undefined, { useSuspense: false });
  const isDesktop = useMedia(LG_SCREEN_SIZE);
  const pageSize = isDesktop ? 6 : 3;

  const [items, setItems] = useState<CastingRolePublicCardResponse[]>(CASTING_ROLE_PUBLIC_CARDS_MOCK);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showEmptyState = !loading && !error && items.length === 0;
  const gridItems = useMemo(() => items, [items]);

  return (
    <section className="w-full h-full min-h-0 bg-[var(--color-secondary-white)]">
      <div className="h-full w-full flex flex-col">
        {/* Mobile Filter Icon */}
        <article className="lg:hidden flex items-center justify-between mb-3 shrink-0 p-5">
          <h2 className="text-2xl font-semibold">{t('casting-database.page.title')}</h2>
          <button
            type="button"
            className="cursor-pointer inline-flex items-center gap-3 shadow-sm rounded-xl"
            aria-label={t('talent.filters.open')}
          >
            <span className="w-12 h-12 flex items-center justify-center bg-[var(--color-primary-white)] rounded-lg">
              <Icon name="filter" variant="primary" size={20} />
            </span>
          </button>
        </article>

        {/* Filter Bar */}
        {/* Content */}
        <div className="py-4 px-6 lg:py-8 w-full max-w-[1500px] m-auto flex-1 min-h-0 h-full overflow-auto overscroll-contain scrollbar-hide [-webkit-overflow-scrolling:touch]">
          <div className="hidden w-full lg:flex flex-row items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">{t('casting-database.page.title')}</h2>
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
                {gridItems.map((it) => (
                  <div key={it.id} className="w-full h-full">
                    <CastingRolePublicCard item={it} />
                  </div>
                ))}
              </article>

              {showEmptyState && (
                <p className="py-18 text-center font-light text-[var(--color-secondary-grey)]">
                  {t('state.no_results')}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default CastingDatabasePage;
