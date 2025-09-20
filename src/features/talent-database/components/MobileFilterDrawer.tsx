import { useEffect, useMemo, useState } from 'react';
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

      <div
        className="
          absolute inset-x-0 bottom-0 max-h-[85vh]
          rounded-t-2xl bg-white shadow-xl
          flex flex-col
          animate-[slideUp_180ms_ease-out]
        "
        role="dialog"
        aria-modal="true"
      >
        {/* handle */}
        <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-neutral-200" />
        <header className="flex items-center justify-between px-4 py-3 border-b">
          <h4 className="text-base font-semibold">Filtros</h4>
          <button
            type="button"
            className="text-sm underline"
            onClick={() => {
              setDraft({});
              onReset?.();
            }}
          >
            Resetear
          </button>
        </header>

        {/* contenido scrollable */}
        <div className="min-h-0 flex-1 overflow-auto px-3 py-3">
          <TalentFilterBar
            value={draft}
            onChange={setDraft}
            // en mobile no aplicamos al cambiar; sólo previsualizamos en draft
          />
        </div>

        {/* footer */}
        <footer className="flex gap-3 p-3 border-t bg-white">
          <button type="button" className="w-1/2 rounded-xl border px-4 py-2 text-sm" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            className="w-1/2 rounded-xl bg-black text-white px-4 py-2 text-sm"
            onClick={() => {
              onApply(draft);
              onClose();
            }}
          >
            Aplicar{selectedCount ? ` (${selectedCount})` : ''}
          </button>
        </footer>
      </div>

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
