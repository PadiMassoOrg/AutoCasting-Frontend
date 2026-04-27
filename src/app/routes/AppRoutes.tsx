import { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes, useLocation, useNavigate } from 'react-router-dom';
import { USER_MODE_EMPLOYER, USER_MODE_TALENT, useUserMode } from '../context/UserModeContext';
import { useAuthToken } from '../features/auth/hooks/useAuthToken';
import { useMeData } from '../features/auth/hooks/useMeData';
import { AuthenticationPage, GoogleAuthSuccessPage, ResetPasswordPage } from '../features/auth/pages';
import CastingDatabasePage from '../features/casting-database/pages/CastingDatabasePage';
import LegalAcceptanceRequiredGate from '../features/legal/components/LegalAcceptanceRequiredGate';
import MainSiteLayout from '../features/main-site/layout/MainSiteLayout';
import { PrivacyPage, SupportPage, TermsPage } from '../features/main-site/page';
import MainSitePage from '../features/main-site/page/MainSitePage';
import { OnboardingWizard } from '../features/onboarding/components';
import { CastingDetailsPage, CastingPublicOverviewPage } from '../features/public-casting/pages';
import { PublicProfilePage } from '../features/public-profile/pages';
import { TalentDatabasePage } from '../features/talent-database/pages';
import { useRouteTracking } from '../integrations/analytics/routeTracking';
import { EmptyLayout, NavigationLayout, ScrollContentLayout } from '../layouts';
import { ScrollToTop } from '../shared/components/ScrollToTop';
import { clearClientSession } from '../shared/lib/authSession';
import { getAuthTokenExpirationTime } from '../shared/lib/cookies';
import { ROUTES } from '../shared/lib/routes';
import ProtectedRoute from './ProtectedRoute';
import ProtectedRoutesLayout from './ProtectedRoutesLayout';

function RouteTracker() {
  useRouteTracking();
  return null;
}

function isProtectedPath(pathname: string) {
  return pathname.startsWith(ROUTES.DASHBOARD);
}

function AuthSessionWatcher() {
  const token = useAuthToken();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      if (isProtectedPath(location.pathname)) {
        navigate(ROUTES.HOME, { replace: true });
      }
      return;
    }

    const expirationTime = getAuthTokenExpirationTime(token);
    if (!expirationTime) return;

    const msUntilExpiration = expirationTime - Date.now();

    if (msUntilExpiration <= 0) {
      clearClientSession();
      if (isProtectedPath(location.pathname)) {
        navigate(ROUTES.HOME, { replace: true });
      }
      return;
    }

    const timerId = window.setTimeout(() => {
      const wasProtectedPath = isProtectedPath(location.pathname);
      clearClientSession();
      if (wasProtectedPath) {
        navigate(ROUTES.HOME, { replace: true });
      }
    }, msUntilExpiration);

    return () => window.clearTimeout(timerId);
  }, [token, location.pathname, navigate]);

  return null;
}

function AppRoutesContent() {
  const token = useAuthToken();
  const { data: meData } = useMeData();
  const { mode, setMode } = useUserMode();

  const hasToken = !!token;
  const hasMeData = !!meData;
  const activeMode = meData?.activeMode;

  useEffect(() => {
    if (!activeMode) {
      return;
    }

    const nextMode = activeMode === 'EMPLOYER' ? USER_MODE_EMPLOYER : USER_MODE_TALENT;
    if (mode !== nextMode) {
      setMode(nextMode);
    }
  }, [activeMode, mode, setMode]);

  const needsInitialWizard = hasToken && hasMeData && meData.activeMode === null;
  const needsTalentWizard =
    hasToken && hasMeData && meData.activeMode === 'TALENT' && meData.talentOnboardingStatus !== 'COMPLETED';
  const needsEmployerWizard =
    hasToken && hasMeData && meData.activeMode === 'EMPLOYER' && meData.employerOnboardingStatus !== 'COMPLETED';

  const shouldForceWizard = hasToken && hasMeData && (needsInitialWizard || needsTalentWizard || needsEmployerWizard);

  if (shouldForceWizard) {
    return (
      <Routes>
        <Route element={<EmptyLayout />}>
          <Route path="*" element={<OnboardingWizard />} />
        </Route>
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<MainSiteLayout />}>
        <Route path={ROUTES.HOME} element={<MainSitePage />} />
      </Route>
      <Route path={ROUTES.AUTH} element={<AuthenticationPage />} />
      <Route path={ROUTES.GOOGLE_OAUTH_SUCCESS} element={<GoogleAuthSuccessPage />} />
      <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
      <Route element={<MainSiteLayout />}>
        <Route path={ROUTES.SUPPORT} element={<SupportPage />} />
        <Route path={ROUTES.TERMS} element={<TermsPage />} />
        <Route path={ROUTES.PRIVACY} element={<PrivacyPage />} />
      </Route>
      <Route element={<NavigationLayout />}>
        <Route path={ROUTES.PUBLIC_PROFILE + '/:slug'} element={<PublicProfilePage />} />
        <Route path={ROUTES.PUBLIC_CASTING + '/:slug/roles/:roleId'} element={<CastingDetailsPage mode="public" />} />
        <Route path={ROUTES.PUBLIC_CASTING + '/:slug'} element={<CastingPublicOverviewPage />} />
      </Route>
      <Route element={<ScrollContentLayout variant="desktop-full-bleed" />}>
        <Route path={ROUTES.TALENT_DATABASE} element={<TalentDatabasePage />} />
        <Route path={ROUTES.CASTING_DATABASE} element={<CastingDatabasePage />} />
      </Route>
      <Route
        path={ROUTES.ALL}
        element={
          <ProtectedRoute>
            <ProtectedRoutesLayout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function AppRoutes() {
  return (
    <Router>
      <AuthSessionWatcher />
      <RouteTracker />
      <ScrollToTop />
      <LegalAcceptanceRequiredGate />
      <AppRoutesContent />
    </Router>
  );
}
