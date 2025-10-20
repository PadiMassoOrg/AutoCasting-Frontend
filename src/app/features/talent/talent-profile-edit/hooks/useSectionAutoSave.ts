// shared/hooks/useSectionAutosave.ts
import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';
import { TALENT_PROFILE_CACHE_KEY } from '../services/talentProfileService';

type OnSuccessUpdate<TResult> = (draft: any, updated: TResult) => any;
type RefetchType = 'active' | 'inactive' | 'all';

export function useSectionAutosave<TPayload, TResult>({
  mutationFn,
  delay = 800,
  onSuccessUpdate,
  cacheKeys = [TALENT_PROFILE_CACHE_KEY],
  invalidateOnSuccess = 'active',
  extraInvalidateKeys = [], // 👈 NUEVO
}: {
  mutationFn: (payload: TPayload) => Promise<TResult>;
  delay?: number;
  onSuccessUpdate: OnSuccessUpdate<TResult>;
  cacheKeys?: ReadonlyArray<QueryKey>;
  invalidateOnSuccess?: false | RefetchType;
  extraInvalidateKeys?: ReadonlyArray<QueryKey>; // 👈 NUEVO
}) {
  const qc = useQueryClient();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef<TPayload | null>(null);
  const [saving, setSaving] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const mutation = useMutation({
    mutationFn,
    onMutate: async () => {
      setSaving('saving');
      pending.current = null;
    },
    onSuccess: (updated) => {
      // 1) actualizo SOLO las cacheKeys indicadas
      for (const key of cacheKeys) {
        qc.setQueriesData({ queryKey: key }, (prev: any) => onSuccessUpdate(prev, updated));
      }
      // 2) invalido mis cacheKeys si querés
      if (invalidateOnSuccess) {
        for (const key of cacheKeys) {
          qc.invalidateQueries({ queryKey: key, refetchType: invalidateOnSuccess });
        }
      }
      // 3) y además invalido OTRAS keys (p.ej. públicas)
      for (const k of extraInvalidateKeys) {
        qc.invalidateQueries({ queryKey: k, refetchType: 'active' });
      }

      setSaving('saved');
      setTimeout(() => setSaving('idle'), 1200);
    },
    onError: () => setSaving('error'),
  });

  const flush = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    if (pending.current) mutation.mutate(pending.current);
  }, [mutation]);

  const schedule = useCallback(
    (payload: TPayload) => {
      pending.current = { ...(pending.current as any), ...(payload as any) };
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => pending.current && mutation.mutate(pending.current), delay);
    },
    [delay, mutation]
  );

  const immediate = useCallback(
    (payload: TPayload) => {
      pending.current = null;
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
      mutation.mutate(payload);
    },
    [mutation]
  );

  return { saving, schedule, immediate, flush };
}
