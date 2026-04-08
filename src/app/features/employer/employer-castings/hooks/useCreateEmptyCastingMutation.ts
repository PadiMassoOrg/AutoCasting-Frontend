import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../../context/ToastContext';
import { ROUTES } from '../../../../shared/lib/routes';
import { handleBackendActionError } from '../../../../shared/utils/backendErrorHandling';
import { createEmptyCasting } from '../services/employerCastingService';

export const useCreateEmptyCastingMutation = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const navigate = useNavigate();

  return useMutation<string, any, any>({
    mutationFn: () => createEmptyCasting(),
    onSuccess: (slug) => {
      navigate(`${ROUTES.EMPLOYER_CASTING}/${slug}/editor`);
    },
    onError: (error) => {
      handleBackendActionError({
        error,
        t,
        showToast: (message) =>
          showToast({
            title: t('general.error'),
            description: message,
            type: 'danger',
          }),
      });
    },
  });
};
