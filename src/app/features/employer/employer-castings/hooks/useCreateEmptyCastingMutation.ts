import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../shared/lib/routes';
import { createEmptyCasting } from '../services/employerCastingService';

export const useCreateEmptyCastingMutation = () => {
  const navigate = useNavigate();

  return useMutation<string, any, any>({
    mutationFn: () => createEmptyCasting(),
    onSuccess: (slug) => {
      navigate(`${ROUTES.EMPLOYER_CASTING}/${slug}/editor`);
    },
  });
};
