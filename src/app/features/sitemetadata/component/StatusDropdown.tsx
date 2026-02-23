import { useMemo } from 'react';
import type { SiteMetadataObject } from '../../../features/sitemetadata/types/sitemetadata.types';
import {
  CASTING_STATUS_ARCHIVED,
  CASTING_STATUS_CLOSED,
  CASTING_STATUS_DRAFT,
  CASTING_STATUS_PAUSED,
  CASTING_STATUS_PUBLISHED,
} from '../../../features/sitemetadata/utils/siteMetadataUtils';
import { ChevronUpDown } from '../../../shared/components/Chevron';
import StatusChip from '../../../shared/components/Chip/StatusChip';
import { OverflowMenu } from '../../../shared/components/OverflowMenu';
import type { OverflowMenuItem } from '../../../shared/components/OverflowMenu/overflowmenu.types';

type Props = {
  value: SiteMetadataObject;
  allowedCodes: string[];
  allOptions: SiteMetadataObject[];
  onSelect: (next: SiteMetadataObject) => void | Promise<void>;
  disabled?: boolean;
};

const CASTING_STATUS_ORDER: string[] = [
  CASTING_STATUS_PUBLISHED,
  CASTING_STATUS_CLOSED,
  CASTING_STATUS_PAUSED,
  CASTING_STATUS_DRAFT,
  CASTING_STATUS_ARCHIVED,
];

export default function StatusDropdown({ value, allowedCodes, allOptions, onSelect, disabled = false }: Props) {
  const options = useMemo(() => {
    if (!allowedCodes?.length) return [];
    const byCode = new Map(allOptions.map((opt) => [opt.stringCode, opt]));

    const ordered = CASTING_STATUS_ORDER.filter((code) => allowedCodes.includes(code))
      .map((code) => byCode.get(code))
      .filter(Boolean) as SiteMetadataObject[];

    const extras = allowedCodes
      .filter((code) => !CASTING_STATUS_ORDER.includes(code))
      .map((code) => byCode.get(code))
      .filter(Boolean) as SiteMetadataObject[];

    return [...ordered, ...extras];
  }, [allowedCodes, allOptions]);

  const isDisabled = disabled || options.length === 0;

  const items = useMemo<OverflowMenuItem[]>(() => {
    if (options.length === 0) return [];

    return options.map<OverflowMenuItem>((opt) => ({
      type: 'item',
      key: opt.stringCode,
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
      menuClassName="!min-w-0 !w-fit"
      trigger={({ open, disabled: trigDisabled }) => (
        <div
          className={[
            'inline-flex items-center gap-1 bg-[var(--color-primary-light-grey)] rounded-full px-1.5 py-1 pl-2.5',
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
