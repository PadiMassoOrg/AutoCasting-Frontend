import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../../context/ToastContext';
import { handleBackendLocalFieldOrToastError } from '../../../../shared/utils/backendErrorHandling';
import { EMPLOYER_PROFILE_CACHE_KEY, patchEmployerBasicInfo } from '../services/employerProfileService';
import type { EmployerProfileBasicInfo } from '../types/employerProfile.types';
import type { EmployerBasicInfoPatchRequest } from '../types/requests';

type EmployerBasicInfoFieldKey = 'companyName' | 'taxNumber';

export const usePatchEmployerBasicInfoMutation = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<EmployerBasicInfoFieldKey, string>>>({});

  const clearFieldError = useCallback((field: EmployerBasicInfoFieldKey) => {
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

  const setFieldError = useCallback((field: EmployerBasicInfoFieldKey, message?: string) => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (!message) delete next[field];
      else next[field] = message;
      return next;
    });
  }, []);

  const mutation = useMutation<EmployerProfileBasicInfo, unknown, EmployerBasicInfoPatchRequest>({
    mutationFn: patchEmployerBasicInfo,
    onMutate: () => {
      clearAllBackendErrors();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYER_PROFILE_CACHE_KEY });
    },
    onError: (error) => {
      handleBackendLocalFieldOrToastError<EmployerBasicInfoFieldKey>({
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

  const submit = useCallback((payload: EmployerBasicInfoPatchRequest) => mutation.mutateAsync(payload), [mutation]);

  return {
    ...mutation,
    submit,
    fieldErrors,
    clearFieldError,
    clearAllBackendErrors,
  };
};
