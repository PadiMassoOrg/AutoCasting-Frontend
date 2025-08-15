// src/shared/hooks/useSectionAutosave.ts
import { useRef, useState, useCallback } from 'react';
import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query';
import { PROFILE_CACHE_KEY } from '../services/profileService';

type OnSuccessUpdate<T> = (draft: any, updated: T) => any;

type RefetchType = 'active' | 'inactive' | 'all';

export function useSectionAutosave<TPayload, TResult>({
  mutationFn,
  delay = 800,
  onSuccessUpdate,
  cacheKeys = [PROFILE_CACHE_KEY],
  invalidateOnSuccess = 'active',
}: {
  mutationFn: (payload: TPayload) => Promise<TResult>;
  delay?: number;
  onSuccessUpdate: OnSuccessUpdate<TResult>;
  cacheKeys?: ReadonlyArray<QueryKey>;
  invalidateOnSuccess?: false | RefetchType;
}) {
  const qc = useQueryClient();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef<TPayload | null>(null);
  const [saving, setSaving] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const mutation = useMutation({
    mutationFn,
    onMutate: async (vars) => {
      setSaving('saving');
      pending.current = null;
      return { vars };
    },
    onSuccess: (updated) => {
      for (const key of cacheKeys) {
        qc.setQueryData(key, (prev: any) => onSuccessUpdate(prev, updated));
      }
      if (invalidateOnSuccess) {
        for (const key of cacheKeys) {
          qc.invalidateQueries({ queryKey: key, refetchType: invalidateOnSuccess });
        }
      }
      setSaving('saved');
      setTimeout(() => setSaving('idle'), 1200);
    },
    onError: () => {
      setSaving('error');
    },
  });

  const flush = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    if (pending.current) {
      mutation.mutate(pending.current);
    }
  }, [mutation]);

  const schedule = useCallback(
    (payload: TPayload) => {
      pending.current = { ...(pending.current as any), ...(payload as any) };
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        if (pending.current) mutation.mutate(pending.current);
      }, delay);
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
