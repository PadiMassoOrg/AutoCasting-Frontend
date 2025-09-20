import { Button, Separator } from 'autocasting-ui-library-padimasso';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TalentFiltersQS } from '../types/talent-database.types';
import { TalentFilterBar } from './TalentFilterBar';

const FOOTER_H = 88;

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
        role="dialog"
        aria-modal="true"
        className="
          absolute bottom-0 right-0
          w-[83%] bg-white
          flex flex-col p-6 gap-0 overflow-hidden
          animate-[slideUp_180ms_ease-out]
        "
        style={{
          // altura real del viewport (usa 1dvh como fallback moderno)
          height: 'calc(var(--app-vh, 1dvh) * 100)',
        }}
      >
        {/* Title */}
        <header className="flex items-center justify-between pb-4">
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

        <Separator className="opacity-20" />

        {/* Contenido scrolleable; deja espacio al footer */}
        <div
          className="flex-1 min-h-0 overflow-y-auto [-webkit-overflow-scrolling:touch]"
          style={{
            paddingBottom: `calc(-${FOOTER_H}px + env(safe-area-inset-bottom, 0px))`,
          }}
        >
          <div className="pt-4">
            <TalentFilterBar value={draft} onChange={setDraft} />
          </div>
        </div>

        <div
          className="
            sticky bottom-0 left-0 right-0
            bg-white pt-4
          "
          style={{ height: `calc(${FOOTER_H}px + env(safe-area-inset-bottom, 0px))` }}
        >
          <Separator className="opacity-20 mb-4" />
          <div className="w-full flex flex-row items-center gap-4 pb-[env(safe-area-inset-bottom)]">
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
