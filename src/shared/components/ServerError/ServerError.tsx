import { Button } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import image from '../../icons/500.svg';
import { FullscreenCenter } from '../Structure';

const ServerError = () => {
  const { t } = useTranslation();
  return (
    <FullscreenCenter zIndex={40}>
      <div className="flex flex-col items-center gap-10">
        <img src={image} alt="error" />
        <div className="flex flex-col gap-3 text-center">
          <h2 className="font-semibold text-2xl"> {t('error_page.title')}</h2>
          <div className="text-[16px] font-light">
            <p className="">{t('error_page.description')}</p>
            <p className="">{t('error_page.subtext')}</p>
          </div>
        </div>
        <Button variant="primary" className="max-w-[250px]">
          {t('routes.go_home')}
        </Button>
      </div>
    </FullscreenCenter>
  );
};

export default ServerError;
