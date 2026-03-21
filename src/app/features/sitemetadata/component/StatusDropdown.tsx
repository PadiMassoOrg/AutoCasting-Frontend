import { useMemo } from 'react';
import type { SiteMetadataObject } from '../../../features/sitemetadata/types/sitemetadata.types';
import { ChevronUpDown } from '../../../shared/components/Chevron';
import StatusChip from '../../../shared/components/Chip/StatusChip';
import { OverflowMenu } from '../../../shared/components/OverflowMenu';
import type { OverflowMenuItem } from '../../../shared/components/OverflowMenu/overflowmenu.types';

type Props = {
  value: SiteMetadataObject;
  allOptions: SiteMetadataObject[];
  onSelect: (next: SiteMetadataObject) => void | Promise<void>;
  disabled?: boolean;
  /**
   * IMPORTANT semantics:
   * - undefined => ALL options allowed (useful for CastingApplication)
   * - []        => NONE allowed (useful for Casting where backend returns empty allowedStatusCodes)
   * - [..]      => only those allowed
   */
  allowedCodes?: string[];
  order?: string[];
  menuClassName?: string;
};

export default function StatusDropdown({
  value,
  allOptions,
  onSelect,
  disabled = false,
  allowedCodes,
  order,
  menuClassName,
}: Props) {
  const options = useMemo(() => {
    if (!allOptions?.length) return [];

    const allowedList =
      allowedCodes === undefined
        ? allOptions
        : allOptions.filter((o) => o.stringCode && allowedCodes.includes(o.stringCode));

    if (!order?.length) return allowedList;

    const byCode = new Map(allowedList.map((opt) => [opt.stringCode, opt] as const));
    const ordered = order.map((code) => byCode.get(code)).filter(Boolean) as SiteMetadataObject[];
    const extras = allowedList.filter((o) => o.stringCode && !order.includes(o.stringCode));

    return [...ordered, ...extras];
  }, [allOptions, allowedCodes, order]);

  const isDisabled = disabled || options.length === 0;

  const items = useMemo<OverflowMenuItem[]>(() => {
    if (options.length === 0) return [];

    return options.map<OverflowMenuItem>((opt) => ({
      type: 'item',
      key: String(opt.stringCode ?? opt.id),
      label: <StatusChip status={opt} variant="inline" align="spaced" />,
      onSelect: () => onSelect(opt),
      closeOnSelect: true,
    }));
  }, [options, onSelect]);

  return (
    <OverflowMenu
      disabled={isDisabled}
      align="end"
      side="bottom"
      items={items}
      menuClassName={['!min-w-0 !w-fit', menuClassName].filter(Boolean).join(' ')}
      trigger={({ open, disabled: trigDisabled }) => (
        <div
          className={[
            'inline-flex items-center gap-1 bg-[var(--color-primary-light-grey)] rounded-full px-1.5 pl-2.5 py-1',
            trigDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          ].join(' ')}
        >
          <StatusChip status={value} variant="inline" />
          <ChevronUpDown open={open} sizePx={18} className="text-[var(--color-primary-black)]" />
        </div>
      )}
    />
  );
}
