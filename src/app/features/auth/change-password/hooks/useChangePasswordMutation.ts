import { useMutation } from '@tanstack/react-query';
import { changePassword } from '../services/changePasswordService';
import type { ChangePasswordRequest } from '../types/changePassword.types';

export const useChangePasswordMutation = () => {
  return useMutation<void, any, ChangePasswordRequest>({
    mutationFn: changePassword,
  });
};
