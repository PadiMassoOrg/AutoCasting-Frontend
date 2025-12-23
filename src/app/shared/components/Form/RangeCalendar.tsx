import * as React from 'react';
import { DayPicker, type DateRange } from 'react-day-picker';

type RangeCalendarProps = {
  label?: string;
  value: DateRange | undefined;
  onChange: (next: DateRange | undefined) => void;
  onCommit?: (from: Date, to: Date) => void;
  weekStartsOn?: 0 | 1;
  className?: string;
  onClear?: () => void;
  clearable?: boolean;
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
}: RangeCalendarProps) {
  const [month, setMonth] = React.useState<Date>(() => getTargetMonth(value));

  React.useEffect(() => {
    const next = getTargetMonth(value);
    if (month.getFullYear() !== next.getFullYear() || month.getMonth() !== next.getMonth()) {
      setMonth(next);
    }
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
    <div className={`${className} flex flex-col`}>
      <div className="flex items-center justify-between mb-2">
        {label ? <div className="text-sm font-semibold">{label}</div> : <span />}
      </div>
      <div className="flex flex-col gap-1">
        <DayPicker
          mode="range"
          navLayout="around"
          weekStartsOn={weekStartsOn}
          month={month}
          onMonthChange={setMonth}
          selected={value}
          onSelect={handleSelect}
          numberOfMonths={1}
          className="p-2 bg-[var(--color-secondary-white)] rounded-2xl border border-[var(--color-secondary-outline)]"
        />
        {clearable && (value?.from || value?.to) ? (
          <button type="button" onClick={onClear} className="min-h-[25px] cursor-pointer text-sm underline font-light ">
            Limpiar
          </button>
        ) : (
          <div className="min-h-[25px]"></div>
        )}
      </div>
      <div className="min-h-[25px]"></div>
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
