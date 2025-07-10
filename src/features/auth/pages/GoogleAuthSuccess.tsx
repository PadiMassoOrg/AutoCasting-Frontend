import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { setAuthToken } from '../../../shared/lib/cookies';
import { ROUTES } from '../../../shared/lib/routes';

const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const timeout = setTimeout(() => {
      if (token) {
        setAuthToken(token);
        navigate(ROUTES.DASHBOARD);
      } else {
        navigate('/auth?error=oauth_failed');
      }
    }, 700); // pequeño delay para que el usuario vea el spinner

    return () => clearTimeout(timeout);
  }, [searchParams, navigate]);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center text-center gap-4">
      <p>Redirigiendo a tu cuenta...</p>
    </div>
  );
};

export default OAuthSuccess;
