import { Button, Separator } from 'autocasting-ui-library-padimasso';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useScrollExitOnEdge } from '../../../shared/hooks/useScrollExitOnEdge';
import type { TalentFiltersQS } from '../types/talent-database.types';
import { TalentFilterBar } from './TalentFilterBar';

const FOOTER_H = 88;

export function MobileFiltersDrawer({
  open,
  onClose,
  value,
  onReset,
  onApply,
}: {
  open: boolean;
  onClose: () => void;
  value: TalentFiltersQS;
  onReset?: () => void;
  onApply?: (next: TalentFiltersQS) => void;
}) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<TalentFiltersQS>(value);
  const contentRef = useRef<HTMLDivElement | null>(null);
  useScrollExitOnEdge(contentRef, { forwardLeftoverToWindow: false });

  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  useEffect(() => {
    if (!open) return;

    const { scrollY } = window;
    const prevHtml = document.documentElement.getAttribute('style') || '';
    const prevBody = document.body.getAttribute('style') || '';

    document.documentElement.style.overscrollBehavior = 'none';
    document.documentElement.style.height = '100%';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    return () => {
      document.documentElement.setAttribute('style', prevHtml);
      document.body.setAttribute('style', prevBody);
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50" style={{ overscrollBehavior: 'contain' }}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <article
        className="fixed bottom-0 right-0 w-[82%] bg-white flex flex-col p-6 gap-0 overflow-hidden"
        style={{ height: '100dvh' }}
        role="dialog"
        aria-modal="true"
      >
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

        <Separator className="opacity-20 my-2" />

        <div
          ref={contentRef}
          style={{
            overscrollBehavior: 'contain', // no “arrastra” al fondo
            paddingBottom: `calc(-${FOOTER_H}px + env(safe-area-inset-bottom, 0px))`,
          }}
          className="flex-1 min-h-0 overflow-y-auto scrollbar-hide [-webkit-overflow-scrolling:touch]"
        >
          <TalentFilterBar value={draft} onChange={setDraft} />
        </div>

        <div
          className="sticky bottom-0 left-0 right-0 bg-white pt-4"
          style={{ height: `calc(${FOOTER_H}px + env(safe-area-inset-bottom, 0px))` }}
        >
          <Separator className="opacity-20 mb-4" />
          <div className="w-full flex flex-row items-center gap-4 pb-[env(safe-area-inset-bottom)]">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                setDraft({});
                onReset?.();
              }}
            >
              {t('general.reset')}
            </Button>
            <Button
              type="button"
              variant="primary"
              className="flex-1"
              onClick={() => {
                onApply?.(draft);
                onClose();
              }}
            >
              {t('general.apply')}
            </Button>
          </div>
        </div>
      </article>

      {/* Keyframes + fix de zoom iOS */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        /* 2) Evitar zoom al enfocar (iOS hace zoom si font-size < 16px) */
        .mobile-filters :where(input, select, textarea) {
          font-size: 16px !important;
          -webkit-text-size-adjust: 100%;
        }
      `}</style>
    </div>
  );
}
