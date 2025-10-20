import Cookies from 'js-cookie';

export const setAuthToken = (token: string) => {
  Cookies.set('authToken', token, { expires: 7 });
};

export const getAuthToken = () => {
  return Cookies.get('authToken');
};

export const clearAuthToken = () => {
  Cookies.remove('authToken');
};
