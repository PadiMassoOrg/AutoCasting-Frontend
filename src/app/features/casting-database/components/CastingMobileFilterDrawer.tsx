import { useEffect, useRef, useState } from 'react';
import { FiltersDrawerActionBar, FiltersDrawerShell } from '../../../shared/components/FiltersDrawer';
import type { CastingFiltersQS } from '../types/casting-database.types';
import { CastingFilterBar } from './CastingFilterBar';

export function CastingMobileFiltersDrawer({
  open,
  onClose,
  value,
  onReset,
  onApply,
}: {
  open: boolean;
  onClose: () => void;
  value: CastingFiltersQS;
  onReset?: () => void;
  onApply?: (next: CastingFiltersQS) => void;
}) {
  const [draft, setDraft] = useState<CastingFiltersQS>(value);
  const contentRef = useRef<HTMLDivElement>(null);
  const draftRef = useRef<CastingFiltersQS>(value);

  useEffect(() => {
    if (open) {
      setDraft(value);
      draftRef.current = value;
    }
  }, [open, value]);

  return (
    <FiltersDrawerShell
      open={open}
      onClose={onClose}
      variant="mobile"
      contentRef={contentRef}
      footer={
        <FiltersDrawerActionBar
          onReset={() => {
            setDraft({} as CastingFiltersQS);
            draftRef.current = {} as CastingFiltersQS;
            onReset?.();
          }}
          onApply={() => {
            onApply?.(draftRef.current);
            onClose();
          }}
        />
      }
    >
      <CastingFilterBar
        value={draft}
        onChange={(next) => {
          draftRef.current = next;
          setDraft(next);
        }}
        onReset={onReset}
        onClose={onClose}
        forwardScrollToRef={contentRef as React.RefObject<HTMLElement | null>}
      />
    </FiltersDrawerShell>
  );
}
