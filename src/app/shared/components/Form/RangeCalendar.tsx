import * as React from 'react';
import { useEffect } from 'react';
import { DayPicker, formatCaption, type DateRange } from 'react-day-picker';
import { DATE_FNS_LOCALE_BY_LANG, useLanguage, WEEKDAYS_SHORT_BY_LANG } from '../../../context/LanguageContext';

type RangeCalendarProps = {
  label?: string;
  value: DateRange | undefined;
  onChange: (next: DateRange | undefined) => void;
  onCommit?: (from: Date, to: Date) => void;
  weekStartsOn?: 0 | 1;
  className?: string;
  onClear?: () => void;
  clearable?: boolean;

  required?: boolean;
};

const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);

const getTargetMonth = (range?: DateRange) => {
  if (range?.from) return startOfMonth(range.from);
  if (range?.to) return startOfMonth(range.to);
  return startOfMonth(new Date());
};

export function RangeCalendar({
  label,
  value,
  onChange,
  onCommit,
  weekStartsOn = 1,
  className,
  onClear,
  clearable = true,
  required = false,
}: RangeCalendarProps) {
  const { lang } = useLanguage();
  const locale = DATE_FNS_LOCALE_BY_LANG[lang];
  const weekdayLabels = WEEKDAYS_SHORT_BY_LANG[lang];

  const minDate = React.useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const maxDate = React.useMemo(() => {
    const d = new Date(minDate);
    d.setFullYear(d.getFullYear() + 2);
    return d;
  }, [minDate]);

  const startMonthLimit = React.useMemo(() => startOfMonth(minDate), [minDate]);
  const endMonthLimit = React.useMemo(() => startOfMonth(maxDate), [maxDate]);

  const [month, setMonth] = React.useState<Date>(() => getTargetMonth(value));

  useEffect(() => {
    const next = getTargetMonth(value);
    setMonth((prev) => {
      if (prev.getFullYear() === next.getFullYear() && prev.getMonth() === next.getMonth()) return prev;
      return next;
    });
  }, [value?.from?.getTime(), value?.to?.getTime()]);

  const handleSelect = React.useCallback(
    (next: DateRange | undefined) => {
      onChange(next);

      const target = getTargetMonth(next);
      if (month.getFullYear() !== target.getFullYear() || month.getMonth() !== target.getMonth()) {
        setMonth(target);
      }

      if (next?.from && next?.to) onCommit?.(next.from, next.to);
    },
    [onChange, onCommit, month]
  );

  return (
    <div className={`${className ?? ''} flex flex-col w-full lg:max-w-[350px]`}>
      {label ? (
        <div className="mb-2 text-sm font-semibold">
          {label}
          {required ? (
            <span className="text-red-500 ml-1" aria-hidden="true">
              *
            </span>
          ) : null}
        </div>
      ) : null}

      <DayPicker
        mode="range"
        navLayout="around"
        weekStartsOn={weekStartsOn}
        month={month}
        onMonthChange={setMonth}
        selected={value}
        onSelect={handleSelect}
        numberOfMonths={1}
        locale={locale}
        startMonth={startMonthLimit}
        endMonth={endMonthLimit}
        disabled={[{ before: minDate }, { after: maxDate }]}
        formatters={{
          formatWeekdayName: (date) => weekdayLabels[date.getDay()],
          formatCaption: (date, options, dateLib) => {
            const s = formatCaption(date, options, dateLib);
            return s ? s[0].toLocaleUpperCase(lang) + s.slice(1) : s;
          },
        }}
        className="w-full p-2 bg-[var(--color-secondary-white)] rounded-2xl border border-[var(--color-secondary-outline)] overflow-hidden"
        styles={{
          root: { width: '100%' },
          months: { width: '100%' },
          month: { width: '100%' },
          month_grid: { width: '100%', tableLayout: 'fixed' },
        }}
      />

      {clearable && (value?.from || value?.to) ? (
        <button type="button" onClick={onClear} className="min-h-[25px] cursor-pointer text-sm underline font-light">
          Limpiar
        </button>
      ) : (
        <div className="min-h-[25px]" />
      )}
    </div>
  );
}

export const toLocalISO = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const parseLocalISODate = (iso?: string | null): Date | undefined => {
  if (!iso) return undefined;
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
};
