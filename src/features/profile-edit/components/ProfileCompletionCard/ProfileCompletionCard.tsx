import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import blackEditIcon from '../../../../shared/icons/edit.svg';
import blackViewIcon from '../../../../shared/icons/view.svg';
import whiteEditIcon from '../../../../shared/icons/whiteEdit.svg';
import whiteViewIcon from '../../../../shared/icons/whiteView.svg';
import { ROUTES } from '../../../../shared/lib/routes';
import type { ProfileProgress } from '../../services/computeProfileProgress';

export function ProfileCompletionCard({
  progress,
  isEdit,
  publicSlug,
}: {
  progress: ProfileProgress;
  isEdit: boolean;
  publicSlug?: string;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const toggleRoute = () => {
    if (isEdit) {
      if (publicSlug) navigate(`${ROUTES.PUBLIC_PROFILE}/${publicSlug}`);
    } else {
      navigate(ROUTES.PROFILE);
    }
  };

  return (
    <div className="w-full flex items-center rounded-full bg-white justify-center pr-2 pl-6 py-2 gap-3 border border-[var(--color-secondary-outline)] max-w-[400px]">
      <article className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold">{t('profile.page.progress_title')}</h3>
          <span className="text-sm font-bold">{progress.total}%</span>
        </div>
        <div className="mt-2 h-3 w-full rounded-full bg-white border border-[var(--color-secondary-outline)]">
          <div
            className="h-full w-full rounded-full  bg-lime-400  border-2 border-lime-400 transition-all"
            style={{ width: `${progress.total}%` }}
          />
        </div>
      </article>
      <span className="w-px h-9 bg-[var(--color-secondary-outline)]" />
      <article
        className="flex items-center rounded-full bg-[var(--color-primary-light-grey)] p-1"
        onClick={toggleRoute}
      >
        <div className="flex flex-row items-center">
          <button
            type="button"
            className={`w-8 h-8 grid place-items-center cursor-pointer ${isEdit ? 'rounded-full bg-black' : ''}`}
          >
            <img src={isEdit ? whiteEditIcon : blackEditIcon} alt="" className="w-[15px] text-white" />
          </button>
          <button
            type="button"
            className={`w-8 h-8 grid place-items-center cursor-pointer ${!isEdit ? 'rounded-full bg-black' : ''}`}
          >
            <img src={isEdit ? blackViewIcon : whiteViewIcon} alt="" className="w-[15px] text-white" />
          </button>
        </div>
      </article>
    </div>
  );
}
