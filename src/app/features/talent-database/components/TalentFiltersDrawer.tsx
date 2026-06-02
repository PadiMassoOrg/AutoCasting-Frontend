import { useEffect, useRef, useState } from 'react';
import { FiltersDrawerActionBar, FiltersDrawerShell } from '../../../shared/components/FiltersDrawer';
import type { TalentFiltersQS } from '../types/talent-database.types';
import { TalentFilterBar } from './TalentFilterBar';

export function TalentFiltersDrawer({
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
  const [draft, setDraft] = useState<TalentFiltersQS>(value);
  const contentRef = useRef<HTMLDivElement>(null);
  const draftRef = useRef<TalentFiltersQS>(value);

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
            setDraft({});
            draftRef.current = {};
            onReset?.();
          }}
          onApply={() => {
            onApply?.(draftRef.current);
            onClose();
          }}
        />
      }
    >
      <TalentFilterBar
        value={draft}
        onChange={(next) => {
          draftRef.current = next;
          setDraft(next);
        }}
        onClose={onClose}
        forwardScrollToRef={contentRef as React.RefObject<HTMLElement | null>}
      />
    </FiltersDrawerShell>
  );
}
