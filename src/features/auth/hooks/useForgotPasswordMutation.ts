import { useMutation } from '@tanstack/react-query';
import { forgotPassword } from '../sevices/authService';

type ForgotPasswordRequest = {
  email: string;
};

export const useForgotPasswordMutation = () => {
  return useMutation<void, any, ForgotPasswordRequest>({
    mutationFn: forgotPassword,
  });
};
