import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { matchPath, useLocation, useNavigate, useParams } from 'react-router-dom';
import { LG_SCREEN_SIZE, useMedia } from '../../../../shared/hooks/useMedia';
import purpleEditIcon from '../../../../shared/icons/edit-purple.svg';
import blackEditIcon from '../../../../shared/icons/edit.svg';
import purpleViewIcon from '../../../../shared/icons/view-purple.svg';
import blackViewIcon from '../../../../shared/icons/view.svg';
import { ROUTES } from '../../../../shared/lib/routes';
import { useTalentProfile } from '../hooks/useTalentProfile';

type Props = {
  className?: string;
  visible?: boolean;
};

export default function TalentProfileModeToggle({ className, visible }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { slug } = useParams<{ slug: string }>();
  const isDesktop = useMedia(LG_SCREEN_SIZE);
  const { data: myProfile } = useTalentProfile();

  // Si todavía no tenemos perfil, no renderizamos nada
  if (!myProfile) return null;

  // --- Detectar modo según la URL actual ---
  const inEditRoute = !!matchPath({ path: ROUTES.TALENT, end: true }, location.pathname);
  const inPublicRoute = !!matchPath({ path: ROUTES.PUBLIC_PROFILE + '/*', end: false }, location.pathname);

  if (!inEditRoute && !inPublicRoute) {
    // No estamos ni en /dashboard/talent ni en /profile/...
    return null;
  }

  const mode: 'edit' | 'view' = inEditRoute ? 'edit' : 'view';

  // --- Owner check ---
  const isOwner =
    mode === 'edit' || // si estoy en /dashboard/talent soy el dueño
    (!!slug && myProfile.publicSlug === slug); // si estoy en /profile/:slug y coincide

  if (!isOwner) return null;

  // --- Datos comunes ---
  const hasPublicSlug = !!myProfile.publicSlug;
  const canPreview = hasPublicSlug;

  const goEdit = () => {
    if (mode === 'view') {
      navigate(ROUTES.TALENT);
    }
  };

  const goPreview = () => {
    if (mode === 'edit' && hasPublicSlug) {
      navigate(`${ROUTES.PUBLIC_PROFILE}/${myProfile.publicSlug}`);
    }
  };

  const editActive = mode === 'edit';
  const viewActive = mode === 'view';

  // ===========================
  // Layout DESKTOP:
  // ===========================
  if (visible) {
    return (
      <div className="fixed z-[200] top-22 right-[32%] w-full max-w-[300px] bg-[var(--color-primary-white)]">
        <article className="w-full p-1 rounded-lg border border-[var(--color-secondary-outline)] shadow-lg flex items-center">
          <button
            type="button"
            onClick={goPreview}
            disabled={!canPreview}
            className={clsx(
              'cursor-pointer w-full h-10 rounded-lg flex items-center justify-center gap-2 flex-1 text-sm font-semibold',
              viewActive
                ? 'bg-[var(--color-secondary-white)] text-[var(--color-primary-purple)] shadow-xs'
                : 'bg-transparent text-black',
              !canPreview && 'opacity-60 cursor-not-allowed'
            )}
          >
            <img src={viewActive ? purpleViewIcon : blackViewIcon} alt="" className="w-[16px] h-[16px]" />
            <span>{t('profile.page.view_profile')}</span>
          </button>

          <div className="w-px h-8 mx-1 self-center bg-[var(--color-secondary-outline)]" />

          <button
            type="button"
            onClick={goEdit}
            className={clsx(
              'cursor-pointer w-full h-10 rounded-lg flex items-center justify-center gap-2 flex-1 text-sm font-semibold',
              editActive
                ? 'bg-[var(--color-secondary-white)] text-[var(--color-primary-purple)] shadow-xs'
                : 'bg-transparent text-black'
            )}
          >
            <img src={editActive ? purpleEditIcon : blackEditIcon} alt="" className="w-[16px] h-[16px]" />
            <span>{t('profile.page.edit_profile')}</span>
          </button>
        </article>
      </div>
    );
  }

  // ===========================
  // Layout MOBILE: barra fija abajo con texto
  // ===========================
  if (!isDesktop)
    return (
      <div
        className={clsx('fixed inset-x-0 bottom-0 z-[50] bg-white flex justify-center pointer-events-none', className)}
      >
        <div className="pointer-events-auto w-full max-w-[460px] p-3">
          <article className="w-full p-1 rounded-lg border border-[var(--color-secondary-outline)] shadow-sm flex items-center">
            <button
              type="button"
              onClick={goPreview}
              disabled={!canPreview}
              className={clsx(
                'cursor-pointer w-full h-10 rounded-lg flex items-center justify-center gap-2 flex-1 text-sm font-semibold',
                viewActive
                  ? 'bg-[var(--color-secondary-white)] text-[var(--color-primary-purple)] shadow-xs'
                  : 'bg-transparent text-black',
                !canPreview && 'opacity-60 cursor-not-allowed'
              )}
            >
              <img src={viewActive ? purpleViewIcon : blackViewIcon} alt="" className="w-[16px] h-[16px]" />
              <span>{t('profile.page.view_profile')}</span>
            </button>

            <div className="w-px h-8 mx-1 self-center bg-[var(--color-secondary-outline)]" />

            <button
              type="button"
              onClick={goEdit}
              className={clsx(
                'cursor-pointer w-full h-10 rounded-lg flex items-center justify-center gap-2 flex-1 text-sm font-semibold',
                editActive
                  ? 'bg-[var(--color-secondary-white)] text-[var(--color-primary-purple)] shadow-xs'
                  : 'bg-transparent text-black'
              )}
            >
              <img src={editActive ? purpleEditIcon : blackEditIcon} alt="" className="w-[16px] h-[16px]" />
              <span>{t('profile.page.edit_profile')}</span>
            </button>
          </article>
        </div>
      </div>
    );
}
