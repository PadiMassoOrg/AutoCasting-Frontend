import { Button, Separator } from 'autocasting-ui-library-padimasso';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TalentFiltersQS } from '../types/talent-database.types';
import { TalentFilterBar } from './TalentFilterBar';

export function MobileFiltersDrawer({
  open,
  onClose,
  value,
  onReset,
}: {
  open: boolean;
  onClose: () => void;
  value: TalentFiltersQS;
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

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <article
        className="
        absolute bottom-0 right-0
        w-[83%] h-screen bg-white
        flex flex-col p-6 pb-2
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
            className="cursor-pointer text-xs underline font-light"
            onClick={() => {
              setDraft({});
              onReset?.();
            }}
          >
            {t('talent.filter.reset')}
          </button>
        </header>

        <Separator className="opacity-20 mt-6" />

        <div className="flex-1 min-h-0 overflow-y-auto [-webkit-overflow-scrolling:touch]">
          <TalentFilterBar value={draft} onChange={setDraft} />
        </div>

        <div className="mt-auto pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] bg-white">
          <Separator className="opacity-20 mb-4" />
          <div className="w-full flex flex-row items-center gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setDraft({});
                onReset?.();
              }}
            >
              {t('general.reset')}
            </Button>
            <Button variant="primary" className="flex-1" onClick={onClose}>
              {t('general.apply')}
            </Button>
          </div>
        </div>
      </article>

      <style>{`
      @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `}</style>
    </div>
  );
}
