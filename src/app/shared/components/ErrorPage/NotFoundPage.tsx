import { Button, FullscreenCenter } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import image from '../../icons/500.svg';
import { ROUTES } from '../../lib/routes';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <FullscreenCenter>
      <div className="flex flex-col items-center gap-10">
        <img src={image} alt="not found" />
        <div className="flex flex-col gap-3 text-center">
          <h2 className="font-semibold text-2xl">{t('error_page.not_found.title')}</h2>
          <div className="text-[16px] font-light">
            <p>{t('error_page.not_found.description')}</p>
            <p>{t('error_page.not_found.subtext')}</p>
          </div>
        </div>
        <Button variant="primary" className="max-w-[250px]" asChild>
          <Link to={ROUTES.HOME}>{t('routes.go_home')}</Link>
        </Button>
      </div>
    </FullscreenCenter>
  );
};

export default NotFoundPage;
