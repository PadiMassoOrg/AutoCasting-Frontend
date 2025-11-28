import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DeleteIconRed from '../../../../../../shared/icons/delete-red.svg';
import type { SiteMetadataObject } from '../../../../../sitemetadata/types/sitemetadata.types';
import { useSocialMediaAutosave } from '../../../hooks/autosaves';
import { getSocialMediaSchema } from '../../../schemas/socialMediaSchema';
import type { LinkState } from './SocialMediaForm';
import { getSocialMediaIcon } from './SocialMediaIconMapper';

type SocialMediaIconSelectProps = {
  allOptions: SiteMetadataObject[];
  usedOptionIds: Set<string>;
  value: string;
  onChange: (nextId: string) => void;
};

const SocialMediaIconSelect = ({ allOptions, usedOptionIds, value, onChange }: SocialMediaIconSelectProps) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const optionsForThisRow = allOptions.filter((opt) => !usedOptionIds.has(opt.id) || opt.id === value);

  const selectedOption =
    optionsForThisRow.find((o) => o.id === value) ??
    allOptions.find((o) => o.id === value) ??
    optionsForThisRow[0] ??
    null;

  const selectedIcon = selectedOption ? getSocialMediaIcon(selectedOption.stringCode) : undefined;

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
        onClick={() => setOpen((prev) => !prev)}
      >
        {selectedIcon && <img src={selectedIcon} alt="" className="w-5 h-5" />}
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
        <div className="absolute z-20 mt-2 p-2 rounded-lg bg-white shadow-lg border border-[var(--color-primary-light-grey)] flex gap-2 flex-wrap">
          {optionsForThisRow.map((opt) => {
            const icon = getSocialMediaIcon(opt.stringCode);
            return (
              <button
                key={opt.id}
                type="button"
                className={`w-8 h-8 rounded-md flex items-center justify-center hover:bg-[var(--color-primary-light-grey)] ${
                  opt.id === value ? 'ring-2 ring-[var(--color-primary)]' : ''
                }`}
                onClick={() => {
                  onChange(opt.id);
                  setOpen(false);
                }}
                title={opt.stringCode}
              >
                {icon && <img src={icon} alt="" className="w-5 h-5" />}
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
  onChange: (next: LinkState) => void;
  onDelete: () => void;
  initialUrlsById: Record<string, string | null>;
};

const SocialMediaRow = ({
  allOptions,
  usedOptionIds,
  value,
  onChange,
  onDelete,
  initialUrlsById,
}: SocialMediaRowProps) => {
  const { t } = useTranslation();
  const autosave = useSocialMediaAutosave();
  const schema = useMemo(() => getSocialMediaSchema(t), [t]);

  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string>(value.url ?? '');

  const previousOptionIdRef = useRef<string | null>(value.optionId);

  useEffect(() => {
    setUrl(value.url ?? '');
  }, [value.url]);

  const optionsForThisRow = useMemo(
    () => allOptions.filter((opt) => !usedOptionIds.has(opt.id) || opt.id === value.optionId),
    [allOptions, usedOptionIds, value.optionId]
  );

  const selectedOption =
    optionsForThisRow.find((o) => o.id === value.optionId) ?? allOptions.find((o) => o.id === value.optionId) ?? null;

  if (!selectedOption) return null;

  const commitUrl = () => {
    const result = schema.shape.url.safeParse(url);
    setError(result.success ? null : (result.error.errors[0]?.message ?? t('validation.url_invalid')));
    if (!result.success) return;

    const trimmed = url.trim();
    const nextUrl = trimmed === '' ? null : trimmed;
    const currentOptionId = selectedOption.id;

    const payload: { links: { optionId: string; url: string | null }[] } = {
      links: [],
    };

    if (previousOptionIdRef.current && previousOptionIdRef.current !== currentOptionId) {
      payload.links.push({
        optionId: previousOptionIdRef.current,
        url: null,
      });
    }

    payload.links.push({
      optionId: currentOptionId,
      url: nextUrl,
    });

    if (payload.links.length > 0) {
      autosave.immediate(payload);
    }

    previousOptionIdRef.current = currentOptionId;

    onChange({
      optionId: currentOptionId,
      url: nextUrl,
    });
  };

  const handleBlur = () => {
    commitUrl();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitUrl();
    }
  };

  const handleChangeOption = (nextOptionId: string) => {
    if (nextOptionId === value.optionId) return;

    previousOptionIdRef.current = value.optionId;

    const previousPersistedUrl = initialUrlsById[nextOptionId] ?? null;

    setUrl(previousPersistedUrl ?? '');
    setError(null);

    onChange({
      optionId: nextOptionId,
      url: previousPersistedUrl,
    });
  };

  const handleDelete = () => {
    autosave.immediate({
      links: [
        {
          optionId: selectedOption.id,
          url: null,
        },
      ],
    });

    onDelete();
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1">
        <div className="flex items-center gap-3 w-full rounded-2xl border border-[var(--color-primary-light-grey)] px-5 h-14 py-3">
          <SocialMediaIconSelect
            allOptions={allOptions}
            usedOptionIds={usedOptionIds}
            value={value.optionId}
            onChange={handleChangeOption}
          />

          <div className="w-px h-6 bg-[var(--color-primary-light-grey)]" />

          <input
            id={`social-url-${value.optionId}`}
            className="flex-1 min-w-0 text-sm text-[var(--color-primary-text)] placeholder:text-[var(--color-primary-grey)] border-none outline-none focus:outline-none focus:ring-0"
            placeholder={t('general.placeholder.url')}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />
        </div>

        {error && <p className="mt-1 pl-2 text-sm text-[var(--color-alert-error)]">{error}</p>}
      </div>

      <img
        src={DeleteIconRed}
        onClick={handleDelete}
        className="cursor-pointer self-center w-[17px]"
        alt={t('general.delete')}
      />
    </div>
  );
};

export default SocialMediaRow;
