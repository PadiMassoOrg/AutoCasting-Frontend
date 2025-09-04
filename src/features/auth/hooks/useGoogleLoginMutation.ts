import { useMutation } from '@tanstack/react-query';
import { googleLogin } from '../services/authService';

export const useGoogleLoginMutation = () => {
  return useMutation({
    mutationFn: googleLogin,
  });
};
