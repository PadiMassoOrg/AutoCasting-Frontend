import clsx from 'clsx';
import { Icon, LG_SCREEN_SIZE, MobileBottomBar, useMedia } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { useOwnTalentProfileNavigation } from '../hooks/useOwnTalentProfileNavigation';

export default function TalentProfileModeToggle() {
  const { t } = useTranslation();
  const isDesktop = useMedia(LG_SCREEN_SIZE);
  const { canShowModeToggle, canViewPublicProfile, goToEditProfile, goToPublicProfile, isTalentMode, pageMode } =
    useOwnTalentProfileNavigation();

  if (!canShowModeToggle || !pageMode) return null;

  const mode = pageMode;
  const editActive = mode === 'edit';
  const viewActive = mode === 'view';

  // ===========================
  // Layout MOBILE: Solo funciona en MOBILE
  // ===========================
  if (!isDesktop && isTalentMode)
    return (
      <MobileBottomBar>
        <article className="w-[90%] m-auto p-1 rounded-lg border border-[var(--color-secondary-outline)] shadow-sm flex items-center">
          <button
            type="button"
            onClick={goToPublicProfile}
            disabled={!canViewPublicProfile}
            className={clsx(
              'cursor-pointer w-full h-10 rounded-lg flex items-center justify-center gap-2 flex-1 text-sm font-semibold',
              viewActive
                ? 'bg-[var(--color-secondary-white)] text-[var(--color-primary-purple)] shadow-xs'
                : 'bg-transparent text-black',
              !canViewPublicProfile && 'opacity-60 cursor-not-allowed'
            )}
          >
            <Icon name="view" variant={viewActive ? 'primary' : 'default'} />
            <span>{t('profile.page.view_profile')}</span>
          </button>

          <div className="w-px h-8 mx-1 self-center bg-[var(--color-secondary-outline)]" />

          <button
            type="button"
            onClick={goToEditProfile}
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
      </MobileBottomBar>
    );
}
