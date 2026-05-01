import { matchPath, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../../../shared/lib/routes';
import { useMeData } from '../../../auth/hooks/useMeData';
import { useTalentProfile } from './useTalentProfile';

type UseOwnTalentProfileNavigationOptions = {
  viewedPublicSlug?: string;
};

export const useOwnTalentProfileNavigation = (options?: UseOwnTalentProfileNavigationOptions) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { slug: routeSlug } = useParams<{ slug: string }>();
  const { data: meData } = useMeData();
  const { data: myProfile } = useTalentProfile();

  const isTalentMode = meData?.activeMode === 'TALENT';
  const ownPublicSlug = myProfile?.publicSlug ?? null;
  const viewedPublicSlug = options?.viewedPublicSlug ?? routeSlug;
  const isOwnPublicProfile = !!ownPublicSlug && !!viewedPublicSlug && ownPublicSlug === viewedPublicSlug;
  const publicProfileUrl = ownPublicSlug ? `${ROUTES.PUBLIC_PROFILE}/${ownPublicSlug}` : null;
  const inEditRoute = !!matchPath({ path: ROUTES.TALENT, end: true }, location.pathname);
  const inPublicRoute = !!matchPath({ path: ROUTES.PUBLIC_PROFILE + '/*', end: false }, location.pathname);
  const pageMode: 'edit' | 'view' | null = inEditRoute ? 'edit' : inPublicRoute ? 'view' : null;
  const canShowModeToggle =
    isTalentMode && (!!(pageMode === 'edit' && myProfile) || (pageMode === 'view' && isOwnPublicProfile));

  return {
    isTalentMode,
    isOwnPublicProfile,
    ownPublicSlug,
    publicProfileUrl,
    canViewPublicProfile: !!publicProfileUrl,
    pageMode,
    canShowModeToggle,
    goToEditProfile: () => navigate(ROUTES.TALENT),
    goToPublicProfile: () => {
      if (publicProfileUrl) {
        navigate(publicProfileUrl);
      }
    },
  };
};
