import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../../context/ToastContext';
import { handleBackendLocalFieldOrToastError } from '../../../../shared/utils/backendErrorHandling';
import {
  EMPLOYER_CASTING_CACHE_KEY,
  EMPLOYER_CASTING_EDITOR_CACHE_KEY,
  EMPLOYER_CASTINGS_LIST_CACHE_KEY,
  updateCasting,
} from '../services/employerCastingService';
import type { CastingBasicInfoFieldKey, EmployerCastingDetailsResponse } from '../types/employerCastings.types';
import type { CastingUpsertRequest } from '../types/requests';

type SaveCastingVars = {
  id: string;
  payload: CastingUpsertRequest;
};

export const useUpdateCastingMutation = (slug?: string) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<CastingBasicInfoFieldKey, string>>>({});

  const clearFieldError = useCallback((field: CastingBasicInfoFieldKey) => {
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

  const setFieldError = useCallback((field: CastingBasicInfoFieldKey, message?: string) => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (!message) delete next[field];
      else next[field] = message;
      return next;
    });
  }, []);

  const mutation = useMutation<EmployerCastingDetailsResponse, unknown, SaveCastingVars>({
    mutationFn: ({ id, payload }) => updateCasting({ id, payload }),
    onMutate: () => {
      clearAllBackendErrors();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: EMPLOYER_CASTINGS_LIST_CACHE_KEY });
      if (slug) {
        await queryClient.invalidateQueries({ queryKey: [...EMPLOYER_CASTING_CACHE_KEY, slug] });
        await queryClient.invalidateQueries({ queryKey: [...EMPLOYER_CASTING_EDITOR_CACHE_KEY, slug] });
      }
    },
    onError: (error) => {
      handleBackendLocalFieldOrToastError<CastingBasicInfoFieldKey>({
        error,
        t,
        setFieldError,
        showToast: (message) =>
          showToast({
            title: t('general.error'),
            description: message,
            type: 'danger',
          }),
      });
    },
  });

  const submit = useCallback(
    (payload: CastingUpsertRequest, id: string) => mutation.mutateAsync({ id, payload }),
    [mutation]
  );

  return {
    ...mutation,
    submit,
    fieldErrors,
    clearFieldError,
    clearAllBackendErrors,
  };
};
