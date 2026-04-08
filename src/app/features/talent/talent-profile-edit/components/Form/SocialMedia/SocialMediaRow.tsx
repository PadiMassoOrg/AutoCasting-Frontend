import { Icon, Label } from 'autocasting-ui-library-padimasso';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { SiteMetadataObject } from '../../../../../sitemetadata/types/sitemetadata.types';
import type { LinkState } from './SocialMediaForm';
import { getSocialMediaIconName } from './SocialMediaIconMapper';

type SocialMediaIconSelectProps = {
  allOptions: SiteMetadataObject[];
  usedOptionIds: Set<string>;
  value: string;
  onChange: (nextId: string) => void;
};

const SocialMediaIconSelect = ({ allOptions, usedOptionIds, value, onChange }: SocialMediaIconSelectProps) => {
  const [open, setOpen] = useState(false);
  const [openUpwards, setOpenUpwards] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const optionsForThisRow = allOptions;

  const selectedOption = allOptions.find((o) => o.id === value) ?? null;

  const selectedIcon = selectedOption ? getSocialMediaIconName(selectedOption.stringCode) : undefined;

  const toggleOpen = () => {
    setOpen((prev) => {
      const next = !prev;
      if (next && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const estimatedDropdownHeight = 350;
        setOpenUpwards(spaceBelow < estimatedDropdownHeight);
      }
      return next;
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        className="flex items-center justify-center gap-2 rounded-lg cursor-pointer"
        onClick={toggleOpen}
      >
        {selectedIcon && <Icon name={selectedIcon} size={16} />}
        <svg className="w-3 h-3" viewBox="0 0 10 6" aria-hidden="true">
          <path
            d="M1 1l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          className={`absolute z-20 p-2 rounded-lg bg-white shadow-lg border border-(--color-primary-light-grey) flex gap-2 flex-wrap ${
            openUpwards ? 'bottom-full mb-2' : 'mt-2'
          }`}
        >
          {optionsForThisRow.map((opt) => {
            const icon = getSocialMediaIconName(opt.stringCode);
            const isDisabled = usedOptionIds.has(opt.id) && opt.id !== value;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={isDisabled}
                className={`w-8 h-8 rounded-md flex items-center justify-center hover:bg-(--color-primary-light-grey) ${
                  opt.id === value ? 'ring-2 ring-(--color-primary)' : ''
                } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => {
                  if (!isDisabled) {
                    onChange(opt.id);
                    setOpen(false);
                  }
                }}
                title={opt.stringCode}
              >
                {icon && <Icon name={icon} size={16} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

type SocialMediaRowProps = {
  allOptions: SiteMetadataObject[];
  usedOptionIds: Set<string>;
  value: LinkState;
  urlField: UseFormRegisterReturn;
  optionIdField: UseFormRegisterReturn;
  errorMessage?: string;
  onOptionChange: (nextId: string) => void;
  onDelete: () => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
};

const SocialMediaRow = ({
  allOptions,
  usedOptionIds,
  value,
  urlField,
  optionIdField,
  errorMessage,
  onOptionChange,
  onDelete,
  onBlur,
  onKeyDown,
}: SocialMediaRowProps) => {
  const { t } = useTranslation();

  const optionsForThisRow = useMemo(
    () => allOptions.filter((opt) => !usedOptionIds.has(opt.id) || opt.id === value.optionId),
    [allOptions, usedOptionIds, value.optionId]
  );

  const selectedOption =
    optionsForThisRow.find((o) => o.id === value.optionId) ?? allOptions.find((o) => o.id === value.optionId) ?? null;

  if (!selectedOption) return null;

  return (
    <>
      <div className="flex items-center gap-2 w-full">
        <div className="flex-1">
          <div className="flex items-center gap-3 w-full rounded-2xl border border-(--color-primary-light-grey) px-5 h-14 py-3">
            <SocialMediaIconSelect
              allOptions={allOptions}
              usedOptionIds={usedOptionIds}
              value={value.optionId}
              onChange={onOptionChange}
            />
            <div className="w-px h-8 bg-(--color-primary-light-grey)" />
            <input type="hidden" {...optionIdField} />
            <div className="w-full flex flex-row items-center justify-between">
              <input
                id={`social-url-${value.optionId}`}
                className="flex-1 min-w-0 text-sm text-(--color-primary-text) placeholder:text-(--color-secondary-grey) border-none outline-none focus:outline-none focus:ring-0"
                placeholder={t('general.placeholder.url')}
                {...urlField}
                onBlur={(e) => {
                  urlField.onBlur?.(e);
                  onBlur(e);
                }}
                onKeyDown={(e) => {
                  onKeyDown(e);
                }}
              />
            </div>
          </div>
        </div>
        <Icon name="delete" variant="danger" onClick={onDelete} className="self-center" size={20} />
      </div>
      {!errorMessage ? (
        <div className="min-h-[25px]" />
      ) : (
        <div className="min-h-[25px]">
          <Label variant="error">{errorMessage}</Label>
        </div>
      )}
    </>
  );
};

export default SocialMediaRow;
