import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../../context/ToastContext';
import { handleBackendLocalFieldOrToastError } from '../../../../shared/utils/backendErrorHandling';
import { TALENT_PROFILE_CACHE_KEY } from '../services/talentProfileService';

type OnSuccessUpdate<TResult> = (draft: any, updated: TResult) => any;
type RefetchType = 'active' | 'inactive' | 'all';

export function useSectionAutosave<TPayload, TResult, TFieldKey extends string = string>({
  mutationFn,
  delay = 800,
  onSuccessUpdate,
  cacheKeys = [TALENT_PROFILE_CACHE_KEY],
  invalidateOnSuccess = 'active',
  extraInvalidateKeys = [],
  lastModifiedCacheKeys = [],
  fieldMap,
  messageFieldMap,
  generalFieldFallback,
}: {
  mutationFn: (payload: TPayload) => Promise<TResult>;
  delay?: number;
  onSuccessUpdate: OnSuccessUpdate<TResult>;
  cacheKeys?: ReadonlyArray<QueryKey>;
  invalidateOnSuccess?: false | RefetchType;
  extraInvalidateKeys?: ReadonlyArray<QueryKey>;
  lastModifiedCacheKeys?: ReadonlyArray<QueryKey>;
  fieldMap?: Partial<Record<string, TFieldKey>>;
  messageFieldMap?: Partial<Record<string, TFieldKey>>;
  generalFieldFallback?: TFieldKey;
}) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const qc = useQueryClient();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef<TPayload | null>(null);
  const lastToastRef = useRef<{ message: string; at: number } | null>(null);
  const [saving, setSaving] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<TFieldKey, string>>>({});

  const clearFieldError = useCallback((field: TFieldKey) => {
    setFieldErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const clearAllBackendErrors = useCallback(() => {
    setFieldErrors({});
  }, []);

  const setFieldError = useCallback((field: TFieldKey, message?: string) => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (!message) delete next[field];
      else next[field] = message;
      return next;
    });
  }, []);

  const routeMutationError = useCallback(
    (error: unknown) => {
      setSaving('error');
      handleBackendLocalFieldOrToastError({
        error,
        t,
        setFieldError,
        showToast: (message) => {
          const now = Date.now();
          const lastToast = lastToastRef.current;

          if (lastToast && lastToast.message === message && now - lastToast.at < 500) {
            return;
          }

          lastToastRef.current = { message, at: now };
          showToast({
            title: t('general.error'),
            description: message,
            type: 'danger',
          });
        },
        fieldMap,
        messageFieldMap,
        generalFieldFallback,
      });
    },
    [fieldMap, generalFieldFallback, messageFieldMap, setFieldError, showToast, t]
  );

  const mutation = useMutation({
    mutationFn,
    onMutate: async () => {
      clearAllBackendErrors();
      setSaving('saving');
      pending.current = null;
    },
    onSuccess: (updated) => {
      clearAllBackendErrors();
      const modifiedAt = readModifiedAt(updated);
      for (const key of cacheKeys) {
        qc.setQueriesData({ queryKey: key }, (prev: any) =>
          applyModifiedAt(onSuccessUpdate(prev, updated), modifiedAt)
        );
      }
      for (const key of lastModifiedCacheKeys) {
        qc.setQueriesData({ queryKey: key }, (prev: any) => applyModifiedAt(prev, modifiedAt));
      }
      if (invalidateOnSuccess) {
        for (const key of cacheKeys) {
          qc.invalidateQueries({ queryKey: key, refetchType: invalidateOnSuccess });
        }
      }
      for (const k of extraInvalidateKeys) {
        qc.invalidateQueries({ queryKey: k, refetchType: 'active' });
      }

      setSaving('saved');
      setTimeout(() => setSaving('idle'), 1200);
    },
    onError: routeMutationError,
  });

  const flush = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    if (pending.current) mutation.mutate(pending.current);
  }, [mutation]);

  const submit = useCallback(
    async (payload: TPayload) => {
      pending.current = null;
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
      return mutation.mutateAsync(payload);
    },
    [mutation]
  );

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

  return {
    saving,
    isPending: saving === 'saving' || mutation.isPending,
    fieldErrors,
    clearFieldError,
    clearAllBackendErrors,
    schedule,
    immediate,
    flush,
    submit,
  };
}

function readModifiedAt(value: unknown): string | null {
  if (!value) return null;
  if (Array.isArray(value)) {
    return value.reduce<string | null>((max, item) => maxIso(max, readModifiedAt(item)), null);
  }

  if (typeof value !== 'object') return null;
  const modifiedAt = (value as { modifiedAt?: unknown }).modifiedAt;
  return typeof modifiedAt === 'string' && modifiedAt ? modifiedAt : null;
}

function applyModifiedAt(value: unknown, modifiedAt: string | null): unknown {
  if (!modifiedAt || !value || typeof value !== 'object' || Array.isArray(value)) return value;
  return { ...(value as Record<string, unknown>), modifiedAt: maxIso((value as any).modifiedAt, modifiedAt) };
}

function maxIso(a: unknown, b: unknown): string | null {
  const left = typeof a === 'string' && a ? a : null;
  const right = typeof b === 'string' && b ? b : null;
  if (!left) return right;
  if (!right) return left;
  return right > left ? right : left;
}
