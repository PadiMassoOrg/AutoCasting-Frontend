import { RangeCalendar, Separator, parseLocalISODate, toLocalISO } from 'autocasting-ui-library-padimasso';
import { useEffect, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { useTranslation } from 'react-i18next';
import type { EventFiltersQS } from '../types/events.types';

export function EventsFilterBar({
  value,
  onChange,
  onClose,
}: {
  value: EventFiltersQS;
  onChange: (v: EventFiltersQS) => void;
  onClose?: () => void;
}) {
  const { t, i18n } = useTranslation();
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  useEffect(() => {
    const from = parseLocalISODate(value.dateFrom);
    const to = parseLocalISODate(value.dateTo);
    setDateRange(!from && !to ? undefined : { from: from ?? to, to: to ?? from });
  }, [value.dateFrom, value.dateTo]);

  return (
    <aside className="z-[300] w-full flex flex-col items-stretch overflow-auto overflow-x-hidden bg-[var(--primary-color-white)]">
      <header className="flex items-center justify-between pb-2">
        <h4 className="text-[14px] font-semibold">{t('general.filter.title')}</h4>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label={t('common.close') || 'Cerrar'}
            className="cursor-pointer p-1 rounded-md text-3xl leading-none"
          >
            ×
          </button>
        ) : null}
      </header>

      <Separator className="opacity-20 my-3" />

      <RangeCalendar
        selectionMode="range"
        label={t('events.filter.dates')}
        className="lg:max-w-none"
        value={dateRange}
        onChange={setDateRange}
        onCommit={(from, to) => {
          onChange({
            ...value,
            dateFrom: from ? toLocalISO(from) : undefined,
            dateTo: to ? toLocalISO(to) : undefined,
          });
        }}
        language={i18n.language}
        displayMode="inline"
        placeholder={t('general.placeholder.select')}
      />
    </aside>
  );
}
