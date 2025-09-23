import { Button } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import image from '../../icons/500.svg';
import FixedViewportCenter from '../Structure/FixedViewportCenter';

const ServerError = () => {
  const { t } = useTranslation();
  return (
    <FixedViewportCenter avoid="#app-navbar">
      <div className="flex flex-col items-center gap-12">
        <img src={image} alt="error" />
        <div className="flex flex-col gap-3 text-center">
          <h2 className="font-semibold text-2xl"> {t('error_page.title')}</h2>
          <div className="text-[16px] font-normal">
            <p className="">{t('error_page.description')}</p>
            <p className="">{t('error_page.subtext')}</p>
          </div>
        </div>
        <Button variant="primary" className="max-w-[250px]">
          {t('routes.go_home')}
        </Button>
      </div>
    </FixedViewportCenter>
  );
};

export default ServerError;
