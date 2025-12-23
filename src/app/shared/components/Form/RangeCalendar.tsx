import * as React from 'react';
import { type DateRange, DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

type RangeCalendarProps = {
  label?: string;
  required?: boolean;
  value: DateRange | undefined; // { from?: Date; to?: Date }
  onChange: (next: DateRange | undefined) => void;
  onCommit?: (from: Date, to: Date) => void;
  className?: string;
};

export function RangeCalendar({ label, required, value, onChange, onCommit, className }: RangeCalendarProps) {
  React.useEffect(() => {
    if (value?.from && value?.to) onCommit?.(value.from, value.to);
  }, [value?.from, value?.to, onCommit]);

  return (
    <div className={className}>
      {label ? (
        <div className="mb-2 text-sm font-semibold">
          {label} {required ? <span className="text-red-600">*</span> : null}
        </div>
      ) : null}

      <div className="w-full max-w-[385px] rounded-2xl border border-[var(--color-secondary-outline)] bg-[var(--color-secondary-white)] p-4">
        <DayPicker
          mode="range"
          selected={value}
          onSelect={onChange}
          showOutsideDays
          numberOfMonths={1}
          weekStartsOn={1}
          className="w-full"
          classNames={{
            months: 'w-full',
            month: 'w-full',
            caption: 'flex items-center justify-between px-2 py-2',
            caption_label: 'text-lg font-semibold',
            nav: 'flex items-center gap-2',
            nav_button:
              'h-10 w-10 rounded-xl border border-[var(--color-secondary-outline)] bg-white hover:bg-[var(--color-secondary-white)]',
            table: 'w-full border-collapse',
            head_row: 'flex w-full',
            head_cell: 'w-full text-center text-sm font-semibold text-[var(--color-secondary-grey)] py-2',
            row: 'flex w-full',
            cell: 'w-full text-center py-1',
            day: 'h-10 w-10 rounded-xl mx-auto hover:bg-white transition-colors',
            day_outside: 'text-[var(--color-secondary-grey)] opacity-60',
            day_disabled: 'opacity-40',
          }}
          modifiersClassNames={{
            range_start: 'bg-lime-300 text-black rounded-full hover:bg-lime-300',
            range_end: 'bg-lime-300 text-black rounded-full hover:bg-lime-300',
            range_middle: 'bg-[rgba(99,102,241,0.10)] text-black rounded-none',
          }}
        />
      </div>
    </div>
  );
}
