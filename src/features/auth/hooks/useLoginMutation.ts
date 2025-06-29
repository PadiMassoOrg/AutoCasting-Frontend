import { useMutation } from '@tanstack/react-query';
import { login } from '../sevices/authService';

type LoginRequest = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
};

export const useLoginMutation = () => {
  return useMutation<LoginResponse, any, LoginRequest>({
    mutationFn: async (data) => {
      const response = await login(data);
      console.log(response);
      return response.data;
    },
    onSuccess: (data) => {
      // Guarda el token en localStorage o en cookies
      console.log(data.token);
      localStorage.setItem('authToken', data.token);
      // Podés hacer una redirección
      window.location.href = '/dashboard';
    },
  });
};
