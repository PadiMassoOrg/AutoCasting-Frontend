import { useMutation } from '@tanstack/react-query';
import api from '../lib/axios';

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
      const response = await api.post('/auth/login', data);
      return response.data;
    },
    onSuccess: (data) => {
      // Guarda el token en localStorage o en cookies
      localStorage.setItem('authToken', data.token);
      // Podés hacer una redirección
      window.location.href = '/dashboard';
    },
  });
};
