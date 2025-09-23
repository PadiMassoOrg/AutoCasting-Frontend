import { Button } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import image from '../../icons/500.svg';

const ServerError = () => {
  const { t } = useTranslation();
  return (
    <div className="w-full min-h-[75vh] grid place-items-center">
      <div className="flex flex-col items-center gap-6">
        <img src={image} alt="error" />
        <div className="flex flex-col gap-2">
          <h2 className=""> {t('error_page.title')}</h2>
          <p className="">{t('error_page.description')}</p>
          <p className="">{t('error_page.subtext')}</p>
        </div>
        <Button variant="primary">{t('routes.go_home')}</Button>
      </div>
    </div>
  );
};

export default ServerError;
