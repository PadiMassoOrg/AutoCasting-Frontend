import { useMutation } from '@tanstack/react-query';
import { googleLogin } from '../sevices/authService';

export const useGoogleLoginMutation = () => {
  return useMutation({
    mutationFn: googleLogin,
  });
};
