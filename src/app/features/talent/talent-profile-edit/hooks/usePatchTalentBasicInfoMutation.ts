import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../../context/ToastContext';
import { handleBackendLocalFieldOrToastError } from '../../../../shared/utils/backendErrorHandling';
import { patchBasicInfo, TALENT_PROFILE_CACHE_KEY } from '../services/talentProfileService';
import type { BasicInfoPatchRequest } from '../types/requests';
import type { TalentProfileBasicInfo } from '../types/talentProfile.types';

type TalentBasicInfoFieldKey = 'stageName';

export const usePatchTalentBasicInfoMutation = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<TalentBasicInfoFieldKey, string>>>({});

  const clearFieldError = useCallback((field: TalentBasicInfoFieldKey) => {
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

  const setFieldError = useCallback((field: TalentBasicInfoFieldKey, message?: string) => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (!message) delete next[field];
      else next[field] = message;
      return next;
    });
  }, []);

  const mutation = useMutation<TalentProfileBasicInfo, unknown, BasicInfoPatchRequest>({
    mutationFn: patchBasicInfo,
    onMutate: () => {
      clearAllBackendErrors();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TALENT_PROFILE_CACHE_KEY });
    },
    onError: (error) => {
      handleBackendLocalFieldOrToastError<TalentBasicInfoFieldKey>({
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

  const submit = useCallback((payload: BasicInfoPatchRequest) => mutation.mutateAsync(payload), [mutation]);

  return {
    ...mutation,
    submit,
    fieldErrors,
    clearFieldError,
    clearAllBackendErrors,
  };
};
