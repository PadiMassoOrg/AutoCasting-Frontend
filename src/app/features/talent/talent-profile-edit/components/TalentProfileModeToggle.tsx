import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { matchPath, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Icon } from 'autocasting-ui-library-padimasso';
import { LG_SCREEN_SIZE, useMedia } from '../../../../shared/hooks/useMedia';
import { ROUTES } from '../../../../shared/lib/routes';
import { useMeData } from '../../../auth/hooks/useMeData';
import { useTalentProfile } from '../hooks/useTalentProfile';

type Props = {
  className?: string;
};

export default function TalentProfileModeToggle({ className }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { slug } = useParams<{ slug: string }>();
  const { data: meData } = useMeData();
  const isDesktop = useMedia(LG_SCREEN_SIZE);
  const { data: myProfile } = useTalentProfile();

  // Si todavía no tenemos perfil, no renderizamos nada
  if (!myProfile || meData?.activeMode !== 'TALENT') return null;

  // --- Detectar modo según la URL actual ---
  const inEditRoute = !!matchPath({ path: ROUTES.TALENT, end: true }, location.pathname);
  const inPublicRoute = !!matchPath({ path: ROUTES.PUBLIC_PROFILE + '/*', end: false }, location.pathname);

  if (!inEditRoute && !inPublicRoute && meData?.activeMode !== 'TALENT') {
    // No estamos ni en /dashboard/talent ni en /profile/...
    return null;
  }

  const mode: 'edit' | 'view' = inEditRoute ? 'edit' : 'view';

  // --- Owner check ---
  const isOwner =
    mode === 'edit' || // si estoy en /dashboard/talent soy el dueño
    (!!slug && myProfile.publicSlug === slug); // si estoy en /profile/:slug y coincide

  if (!isOwner || meData?.activeMode !== 'TALENT') return null;

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
  // Layout MOBILE: Solo funciona en MOBILE
  // ===========================
  if (!isDesktop && meData?.activeMode === 'TALENT')
    return (
      <div
        className={clsx(
          'fixed inset-x-0 bottom-0 z-[20] bg-white flex justify-center pointer-events-none shadow-[0_-4px_12px_rgba(0,0,0,0.07)]',
          className
        )}
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
              <Icon name="view" variant={viewActive ? 'primary' : 'default'} />
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
              <Icon name="edit" variant={editActive ? 'primary' : 'default'} />
              <span>{t('profile.page.edit_profile')}</span>
            </button>
          </article>
        </div>
      </div>
    );
}
