import { FullscreenCenter, Spinner } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import image from '../../icons/loading_icon.svg';

const PageLoading = () => {
  const { t } = useTranslation();
  return (
    <FullscreenCenter>
      <div className="flex flex-col items-center gap-10">
        <img src={image} alt="loading" />
        <div className="flex gap-4 items-center">
          <h2 className="font-semibold text-[32px]"> {t('state.loading')}</h2>
          <Spinner></Spinner>
        </div>
      </div>
    </FullscreenCenter>
  );
};

export default PageLoading;
