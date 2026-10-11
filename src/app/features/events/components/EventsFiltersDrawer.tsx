import { useEffect, useRef, useState } from 'react';
import { FiltersDrawerActionBar, FiltersDrawerShell } from '../../../shared/components/FiltersDrawer';
import type { EventFiltersQS } from '../types/events.types';
import { EventsFilterBar } from './EventsFilterBar';

export function EventsFiltersDrawer({
  open,
  onClose,
  variant,
  value,
  onReset,
  onApply,
}: {
  open: boolean;
  onClose: () => void;
  variant: 'mobile' | 'desktop';
  value: EventFiltersQS;
  onReset: () => void;
  onApply: (next: EventFiltersQS) => void;
}) {
  const [draft, setDraft] = useState<EventFiltersQS>(value);
  const draftRef = useRef<EventFiltersQS>(value);

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
      variant={variant}
      footer={
        <FiltersDrawerActionBar
          onReset={() => {
            setDraft({});
            draftRef.current = {};
            onReset();
            onClose();
          }}
          onApply={() => {
            onApply(draftRef.current);
            onClose();
          }}
        />
      }
    >
      <EventsFilterBar
        value={draft}
        onChange={(next) => {
          draftRef.current = next;
          setDraft(next);
        }}
        onClose={onClose}
      />
    </FiltersDrawerShell>
  );
}
