import { useCallback, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useBackendErrorToast } from '../../../../shared/hooks/useBackendErrorToast';
import { handleBackendLocalFieldOrToastError } from '../../../../shared/utils/backendErrorHandling';
import {
  createCastingRole,
  EMPLOYER_CASTING_EDITOR_CACHE_KEY,
  EMPLOYER_CASTING_ROLE_CACHE_KEY,
  updateCastingRole,
} from '../services/employerCastingService';
import type { CastingRoleFieldKey, CastingRoleResponse } from '../types/employerCastings.types';
import type { CastingRoleRequest } from '../types/requests';

type UpsertCastingRoleVars = {
  roleId?: string;
  payload: CastingRoleRequest;
};

export const useUpsertCastingRoleMutation = (slug?: string) => {
  const { t } = useTranslation();
  const showErrorToast = useBackendErrorToast();
  const queryClient = useQueryClient();
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<CastingRoleFieldKey, string>>>({});

  const clearFieldError = useCallback((field: CastingRoleFieldKey) => {
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

  const setFieldError = useCallback((field: CastingRoleFieldKey, message?: string) => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (!message) delete next[field];
      else next[field] = message;
      return next;
    });
  }, []);

  const mutation = useMutation<CastingRoleResponse, unknown, UpsertCastingRoleVars>({
    mutationFn: ({ roleId, payload }) => {
      if (!roleId) return createCastingRole(payload);
      return updateCastingRole({ roleId, payload });
    },
    onMutate: () => {
      clearAllBackendErrors();
    },
    onSuccess: async (savedRole) => {
      if (slug) {
        await queryClient.invalidateQueries({ queryKey: [...EMPLOYER_CASTING_EDITOR_CACHE_KEY, slug] });
      }
      queryClient.setQueriesData({ queryKey: [...EMPLOYER_CASTING_ROLE_CACHE_KEY, savedRole.id] }, savedRole);
      await queryClient.invalidateQueries({
        queryKey: [...EMPLOYER_CASTING_ROLE_CACHE_KEY, savedRole.id],
      });
    },
    onError: (error) => {
      handleBackendLocalFieldOrToastError<CastingRoleFieldKey>({
        error,
        t,
        setFieldError,
        showToast: showErrorToast,
      });
    },
  });

  const submit = useCallback(
    (payload: CastingRoleRequest, roleId?: string) => mutation.mutateAsync({ roleId, payload }),
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
