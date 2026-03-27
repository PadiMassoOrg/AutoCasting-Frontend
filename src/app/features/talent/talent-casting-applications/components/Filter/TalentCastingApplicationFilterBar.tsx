import { OverflowMenu, TextDropdownTrigger } from 'autocasting-ui-library-padimasso';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SearchInput from '../../../../../shared/components/Search/SearchInput';
import { AUDITABLE_ORDER_BY } from '../../../../../shared/types/orderBy.types';
import type { TalentCastingApplicationsOrderBy } from '../../types/talentCastingApplicationFilters.types';
import TalentCastingApplicationFilterMenuContent from './TalentCastingApplicationFilterMenuContent';

export type TalentCastingApplicationsFiltersState = {
  castingStatusIdTokens?: string[];
  projectTypeIdTokens?: string[];
  modalityIdTokens?: string[];
  search?: string;
};

type Props = {
  filters: TalentCastingApplicationsFiltersState;
  onFiltersChange: (next: TalentCastingApplicationsFiltersState) => void;
  orderBy: TalentCastingApplicationsOrderBy;
  onOrderByChange: (next: TalentCastingApplicationsOrderBy) => void;
};

const TalentCastingApplicationFilterBar = ({ filters, onFiltersChange, orderBy, onOrderByChange }: Props) => {
  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState(filters.search ?? '');

  useEffect(() => {
    setSearchInput(filters.search ?? '');
  }, [filters.search]);

  const filterItems = useMemo(
    () => [
      {
        type: 'content' as const,
        key: 'filters-content',
        content: <TalentCastingApplicationFilterMenuContent value={filters} onChange={onFiltersChange} />,
      },
    ],
    [filters, onFiltersChange]
  );

  const orderItems = useMemo(() => {
    const mkLabel = (active: boolean, text: string) => (
      <span className={active ? 'text-[var(--color-primary-purple)]' : 'text-[var(--color-primary-black)]'}>
        {text}
      </span>
    );

    return [
      {
        key: AUDITABLE_ORDER_BY.CREATION_DATE_DESC,
        label: mkLabel(orderBy === AUDITABLE_ORDER_BY.CREATION_DATE_DESC, t('general.order.application_desc')),
        onSelect: () => onOrderByChange(AUDITABLE_ORDER_BY.CREATION_DATE_DESC),
      },
      {
        key: AUDITABLE_ORDER_BY.CREATION_DATE_ASC,
        label: mkLabel(orderBy === AUDITABLE_ORDER_BY.CREATION_DATE_ASC, t('general.order.application_asc')),
        onSelect: () => onOrderByChange(AUDITABLE_ORDER_BY.CREATION_DATE_ASC),
      },
    ];
  }, [orderBy, onOrderByChange, t]);

  return (
    <section className="flex flex-row items-center justify-between gap-3">
      <article className="w-full flex flex-col sm:flex-row gap-2">
        <div className="w-full sm:w-[240px]">
          <SearchInput
            value={searchInput}
            onChange={setSearchInput}
            onCommit={(v) => {
              const next = v.trim();
              const current = (filters.search ?? '').trim();

              if (next === current) return;

              onFiltersChange({
                ...filters,
                search: next.length ? next : undefined,
              });
            }}
            placeholder={t('general.search')}
          />
        </div>

        <div className="flex flex-row gap-2 pl-1">
          <OverflowMenu
            items={filterItems}
            align="start"
            side="bottom"
            trigger={() => <TextDropdownTrigger label={t('general.filter.filter')} open />}
          />
          <OverflowMenu
            items={orderItems}
            align="start"
            side="bottom"
            trigger={() => <TextDropdownTrigger label={t('general.order.order')} open />}
          />
        </div>
      </article>
    </section>
  );
};

export default TalentCastingApplicationFilterBar;
