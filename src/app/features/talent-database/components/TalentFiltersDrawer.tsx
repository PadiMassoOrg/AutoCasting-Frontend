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

  useEffect(() => {
    if (open) setDraft(value);
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
            onReset?.();
          }}
          onApply={() => {
            onApply?.(draft);
            onClose();
          }}
        />
      }
    >
      <TalentFilterBar
        value={draft}
        onChange={setDraft}
        onReset={onReset}
        onClose={onClose}
        forwardScrollToRef={contentRef as React.RefObject<HTMLElement | null>}
      />
    </FiltersDrawerShell>
  );
}
