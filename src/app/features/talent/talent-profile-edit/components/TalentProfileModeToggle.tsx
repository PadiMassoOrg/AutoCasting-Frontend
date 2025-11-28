import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import purpleEditIcon from '../../../../shared/icons/edit-purple.svg';
import blackEditIcon from '../../../../shared/icons/edit.svg';
import purpleViewIcon from '../../../../shared/icons/view-purple.svg';
import blackViewIcon from '../../../../shared/icons/view.svg';
import { ROUTES } from '../../../../shared/lib/routes';

type Props = {
  isEdit: boolean;
  publicSlug?: string;
  className?: string;
};

export default function TalentProfileModeToggle({ isEdit, publicSlug, className }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGoEdit = () => {
    if (!isEdit) navigate(ROUTES.TALENT);
  };

  const handleGoPreview = () => {
    if (isEdit && publicSlug) {
      navigate(`${ROUTES.PUBLIC_PROFILE}/${publicSlug}`);
    }
  };

  const editActive = isEdit;
  const viewActive = !isEdit;
  const canPreview = !!publicSlug;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-[50] bg-white flex justify-center pointer-events-none ${className ?? ''}`}
    >
      <div className="pointer-events-auto w-full max-w-[460px] p-3">
        <article className="w-full p-1 rounded-lg border border-[var(--color-secondary-outline)] shadow-sm flex items-center">
          <button
            type="button"
            onClick={handleGoPreview}
            disabled={!canPreview}
            className={`cursor-pointer w-full h-10 rounded-lg flex items-center justify-center gap-2 flex-1 text-sm font-semibold ${
              !editActive
                ? 'bg-[var(--color-secondary-white)] text-[var(--color-primary-purple)] shadow-xs'
                : 'bg-transparent text-black'
            }`}
          >
            <img src={viewActive ? purpleViewIcon : blackViewIcon} alt="" className="w-[16px] h-[16px]" />
            <span>{t('profile.page.view_profile')}</span>
          </button>

          <div className="w-px h-8 mx-1 self-center bg-[var(--color-secondary-outline)]" />

          <button
            type="button"
            onClick={handleGoEdit}
            className={`cursor-pointer w-full h-10 rounded-lg flex items-center justify-center gap-2 flex-1 text-sm font-semibold ${
              editActive
                ? 'bg-[var(--color-secondary-white)] text-[var(--color-primary-purple)] shadow-xs'
                : 'bg-transparent text-black'
            }`}
          >
            <img src={editActive ? purpleEditIcon : blackEditIcon} alt="" className="w-[16px] h-[16px]" />
            <span>{t('profile.page.edit_profile')}</span>
          </button>
        </article>
      </div>
    </div>
  );
}
