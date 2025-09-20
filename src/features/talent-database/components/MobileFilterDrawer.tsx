import { Separator } from 'autocasting-ui-library-padimasso';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TalentFiltersQS } from '../types/talent-database.types';
import { TalentFilterBar } from './TalentFilterBar';

export function MobileFiltersDrawer({
  open,
  onClose,
  value,
  onApply,
  onReset,
}: {
  open: boolean;
  onClose: () => void;
  value: TalentFiltersQS;
  onApply: (v: TalentFiltersQS) => void;
  onReset?: () => void;
}) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<TalentFiltersQS>(value);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const selectedCount = useMemo(() => {
    const isSet = (x: unknown) => x !== undefined && x !== '' && !(Array.isArray(x) && x.length === 0);
    const singles = [
      draft.stageName,
      draft.genderId,
      draft.hairColorId,
      draft.eyeColorId,
      draft.ageMin,
      draft.ageMax,
      draft.heightMinCm,
      draft.heightMaxCm,
      draft.tattoo,
      draft.passport,
      draft.drivingLicense,
    ].filter(isSet).length;
    const lists = (draft.professionId?.length ?? 0) + (draft.skillId?.length ?? 0);
    return singles + (lists > 0 ? 1 : 0);
  }, [draft]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <article
        className="
          absolute bottom-0 right-0
          w-[83%] h-screen bg-white
          flex flex-col p-6 gap-4
          animate-[slideUp_180ms_ease-out]
        "
        role="dialog"
        aria-modal="true"
      >
        {/* Title */}
        <header className="flex items-center justify-between">
          <h4 className="text-[14px] font-semibold">{t('talent.filter.title')}</h4>
          <button
            type="button"
            className="text-xs underline font-light"
            onClick={() => {
              setDraft({});
              onReset?.();
            }}
          >
            {t('talent.filter.reset')}
          </button>
        </header>
        <Separator className="opacity-20 my-4"></Separator>

        {/* Content */}
        <TalentFilterBar value={draft} onChange={setDraft} />
      </article>

      {/* keyframes inline */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
