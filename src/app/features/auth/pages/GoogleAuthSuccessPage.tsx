import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import NoNavigationLayout from '../../../layouts/NoNavigationLayout';
import { setAuthToken } from '../../../shared/lib/cookies';
import { ROUTES } from '../../../shared/lib/routes';
import { jwtDecoder } from '../../../shared/utils/jwtDecoder';

const GoogleAuthSuccessPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setAuthToken(token);
      const payload = jwtDecoder(token);
      const slug = payload?.publicSlug;
      if (slug) {
        navigate(`${ROUTES.PUBLIC_PROFILE}/${slug}`, { replace: true });
      } else {
        navigate(ROUTES.DASHBOARD, { replace: true });
      }
    } else {
      navigate(`${ROUTES.AUTH}?error=oauth_failed`);
    }
  }, [searchParams, navigate]);

  return (
    <NoNavigationLayout>
      <div className="w-full h-screen flex flex-col items-center justify-center text-center gap-4">
        <p>{t('state.loading')}</p>
      </div>
    </NoNavigationLayout>
  );
};

export default GoogleAuthSuccessPage;
