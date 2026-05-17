import { Button, ChevronLeft, ChevronRight } from 'autocasting-ui-library-padimasso';

type Props = {
  page: number;
  size: number;
  hasNext: boolean;
  totalCount?: number | null;
  onPageChange: (page: number) => void;
};

const CastingCatalogPagination = ({ page, size, hasNext, totalCount, onPageChange }: Props) => {
  const totalPages = totalCount && totalCount > 0 ? Math.ceil(totalCount / size) : null;

  // TODO: Refinar CSS
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-(--color-secondary-outline) pt-4">
      <p className="text-sm font-light text-(--color-secondary-grey-fonts)">
        {totalPages ? `Página ${page + 1} de ${totalPages}` : `Página ${page + 1}`}
      </p>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className="!w-auto"
          disabled={page <= 0}
          onClick={() => onPageChange(Math.max(0, page - 1))}
        >
          <ChevronLeft />
          Anterior
        </Button>
        <Button
          type="button"
          variant="outline"
          className="!w-auto"
          disabled={!hasNext}
          onClick={() => onPageChange(page + 1)}
        >
          Siguiente
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};

export default CastingCatalogPagination;
