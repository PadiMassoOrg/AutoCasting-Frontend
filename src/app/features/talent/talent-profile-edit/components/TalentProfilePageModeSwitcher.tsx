import { IconViewSwitcher } from 'autocasting-ui-library-padimasso';
import { useOwnTalentProfileNavigation } from '../hooks/useOwnTalentProfileNavigation';

type TalentProfilePageModeSwitcherProps = {
  viewedPublicSlug?: string;
  className?: string;
};

export default function TalentProfilePageModeSwitcher({
  viewedPublicSlug,
  className,
}: TalentProfilePageModeSwitcherProps) {
  const { canShowModeToggle, canViewPublicProfile, goToEditProfile, goToPublicProfile, pageMode } =
    useOwnTalentProfileNavigation({
      viewedPublicSlug,
    });

  if (!canShowModeToggle || !pageMode) return null;

  return (
    <IconViewSwitcher
      items={['edit', 'view']}
      defaultSelected={pageMode}
      disabled={!canViewPublicProfile}
      className={className}
      onChange={(next) => {
        if (next === 'edit') {
          goToEditProfile();
          return;
        }

        goToPublicProfile();
      }}
    />
  );
}
