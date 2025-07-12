import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { setAuthToken } from '../../../shared/lib/cookies';
import { ROUTES } from '../../../shared/lib/routes';
import { useTranslation } from 'react-i18next';
import { Layout } from '../../../shared/components/Layouts';

const GoogleAuthSuccessPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setAuthToken(token);
      navigate(ROUTES.DASHBOARD);
    } else {
      navigate(`${ROUTES.AUTH}?error=oauth_failed`);
    }
  }, [searchParams, navigate]);

  return (
    <Layout>
      <div className="w-full h-screen flex flex-col items-center justify-center text-center gap-4">
        <p>{t('general.state.loading')}</p>
      </div>
    </Layout>
  );
};

export default GoogleAuthSuccessPage;
