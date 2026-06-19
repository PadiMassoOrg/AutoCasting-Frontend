import { Button, FullscreenCenter } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import image from '../../icons/500.svg';
import { ROUTES } from '../../lib/routes';

const ServerErrorPage = () => {
  const { t } = useTranslation();

  return (
    <FullscreenCenter>
      <div className="flex flex-col items-center gap-10">
        <img src={image} alt="error" />
        <div className="flex flex-col gap-3 text-center">
          <h2 className="font-semibold text-2xl"> {t('error_page.general.title')}</h2>
          <div className="text-[16px] font-light">
            <p className="">{t('error_page.general.description')}</p>
            <p className="">{t('error_page.general.subtext')}</p>
          </div>
        </div>
        <Button variant="primary" className="max-w-[250px]" asChild>
          <Link to={ROUTES.HOME}>{t('routes.go_home')}</Link>
        </Button>
      </div>
    </FullscreenCenter>
  );
};

export default ServerErrorPage;
