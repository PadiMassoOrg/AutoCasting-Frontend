import { useMutation } from '@tanstack/react-query';
import { changePassword } from '../services/accountService';
import type { ChangePasswordRequest } from '../types/account.types';
export const useChangePasswordMutation = () => {
  return useMutation<void, any, ChangePasswordRequest>({
    mutationFn: changePassword,
    onSuccess: () => {
      console.log('Hola');
    },
  });
};
