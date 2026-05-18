import { ChevronLeft, ChevronRight, SectionCard } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';

type Props = {
  page: number;
  size: number;
  hasNext: boolean;
  totalCount?: number | null;
  onPageChange: (page: number) => void;
};

const CastingCatalogPagination = ({ page, size, hasNext, totalCount, onPageChange }: Props) => {
  const { t } = useTranslation();

  const totalPages = totalCount && totalCount > 0 ? Math.ceil(totalCount / size) : null;
  const canGoPrev = page > 0;
  const canGoNext = hasNext;
  const canGoLast = totalPages != null && totalPages > page + 1;
  const chevronSize = 18;

  return (
    <SectionCard>
      <article className="flex items-center justify-center gap-6">
        <p className="text-sm">
          {totalPages
            ? `${t('general.pagination.page')} ${page + 1} ${t('general.pagination.of')} ${totalPages}`
            : `${t('general.pagination.page')} ${page + 1}`}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(0)}
            disabled={!canGoPrev}
            aria-label={t('general.pagination.first_page')}
            className="ounded-md disabled:cursor-not-allowed disabled:opacity-20"
          >
            <ChevronLeft double sizePx={chevronSize} />
          </button>
          <button
            type="button"
            onClick={() => onPageChange(Math.max(0, page - 1))}
            disabled={!canGoPrev}
            aria-label={t('general.pagination.previous_page')}
            className="disabled:cursor-not-allowed disabled:opacity-20"
          >
            <ChevronLeft sizePx={chevronSize} />
          </button>
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={!canGoNext}
            aria-label={t('general.pagination.next_page')}
            className="disabled:cursor-not-allowed disabled:opacity-20"
          >
            <ChevronRight sizePx={chevronSize} />
          </button>
          <button
            type="button"
            onClick={() => {
              if (totalPages == null) return;
              onPageChange(totalPages - 1);
            }}
            disabled={!canGoLast}
            aria-label={t('general.pagination.last_page')}
            className="disabled:cursor-not-allowed disabled:opacity-20"
          >
            <ChevronRight double sizePx={chevronSize} />
          </button>
        </div>
      </article>
    </SectionCard>
  );
};

export default CastingCatalogPagination;
