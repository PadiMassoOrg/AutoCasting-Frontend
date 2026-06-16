import FilterToggleButton from '../../../shared/components/FilterToggleButton/FilterToggleButton';

type CardsPaneHeaderProps = {
  title: string;
  filtersOpen: boolean;
  activeFilterCount: number;
  onToggleFilters: () => void;
  t: (key: string) => string;
};

export default function CastingDatabaseCardsPane({
  title,
  filtersOpen,
  activeFilterCount,
  onToggleFilters,
  t,
}: CardsPaneHeaderProps) {
  return (
    <div className="bg-(--color-secondary-white) pb-5 pt-2 pr-2">
      <div className="flex items-center justify-between gap-4 overflow-visible">
        <h1 className="text-2xl font-bold text-(--color-primary-black) leading-tight">{title}</h1>
        <FilterToggleButton
          open={filtersOpen}
          count={activeFilterCount}
          onClick={onToggleFilters}
          ariaLabel={filtersOpen ? t('general.filter.hide') : t('general.filter.show')}
          ariaPressed={filtersOpen}
        />
      </div>
    </div>
  );
}
