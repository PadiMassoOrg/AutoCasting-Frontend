import { Suspense, lazy, useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes, useLocation, useNavigate } from 'react-router-dom';
import { PageLoading } from 'autocasting-ui-library-padimasso';
import { USER_MODE_EMPLOYER, USER_MODE_TALENT, useUserMode } from '../context/UserModeContext';
import { useAuthToken } from '../features/auth/hooks/useAuthToken';
import { useMeData } from '../features/auth/hooks/useMeData';
import LegalAcceptanceRequiredGate from '../features/legal/components/LegalAcceptanceRequiredGate';
import { useRouteTracking } from '../integrations/analytics/routeTracking';
import { EmptyLayout, NavigationLayout, ScrollContentLayout } from '../layouts';
import ScrollToTopOnRouteChange from '../shared/components/ScrollToTopOnRouteChange';
import { clearClientSession } from '../shared/lib/authSession';
import { getOrStartRefresh } from '../shared/lib/axios';
import { getAuthTokenExpirationTime } from '../shared/lib/cookies';
import { ROUTES } from '../shared/lib/routes';
import ProtectedRoute from './ProtectedRoute';
import ProtectedRoutesLayout from './ProtectedRoutesLayout';

const AuthenticationPage = lazy(() => import('../features/auth/pages/AuthenticationPage'));
const GoogleAuthSuccessPage = lazy(() => import('../features/auth/pages/GoogleAuthSuccessPage'));
const ResetPasswordPage = lazy(() => import('../features/auth/pages/ResetPasswordPage'));
const CastingDatabasePage = lazy(() => import('../features/casting-database/pages/CastingDatabasePage'));
const MainSiteLayout = lazy(() => import('../features/main-site/layout/MainSiteLayout'));
const PrivacyPage = lazy(() => import('../features/main-site/page/PrivacyPage'));
const SupportPage = lazy(() => import('../features/main-site/page/SupportPage'));
const TermsPage = lazy(() => import('../features/main-site/page/TermsPage'));
const OnboardingWizard = lazy(() => import('../features/onboarding/components/OnboardingWizard'));
const CastingDetailsPage = lazy(() => import('../features/public-casting/pages/CastingDetailsPage'));
const CastingPublicOverviewPage = lazy(() => import('../features/public-casting/pages/CastingPublicOverviewPage'));
const PublicProfilePage = lazy(() => import('../features/public-profile/pages/PublicProfilePage'));
const TalentDatabasePage = lazy(() => import('../features/talent-database/pages/TalentDatabasePage'));

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

    // The access token's own exp claim being reached only means it needs to be
    // silently refreshed, not that the session is dead — attempt that first (shared
    // with the axios interceptor's single-flight refresh) and only actually log the
    // user out if the refresh token is also invalid/expired/revoked.
    const handleExpiry = async () => {
      const wasProtectedPath = isProtectedPath(location.pathname);
      const newToken = await getOrStartRefresh();
      if (newToken) return;

      clearClientSession();
      if (wasProtectedPath) {
        navigate(ROUTES.HOME, { replace: true });
      }
    };

    const msUntilExpiration = expirationTime - Date.now();

    if (msUntilExpiration <= 0) {
      void handleExpiry();
      return;
    }

    const timerId = window.setTimeout(() => {
      void handleExpiry();
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
      <Route element={<ScrollContentLayout variant="desktop-full-bleed" />}>
        <Route path={ROUTES.HOME} element={<TalentDatabasePage />} />
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
      </Route>
      <Route element={<ScrollContentLayout variant="desktop-full-bleed" />}>
        <Route path={ROUTES.PUBLIC_CASTING + '/:slug/roles/:roleId'} element={<CastingDetailsPage />} />
        <Route path={ROUTES.PUBLIC_CASTING + '/:slug'} element={<CastingPublicOverviewPage />} />
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
      <Suspense fallback={<PageLoading />}>
        <AuthSessionWatcher />
        <RouteTracker />
        <ScrollToTopOnRouteChange />
        <LegalAcceptanceRequiredGate />
        <AppRoutesContent />
      </Suspense>
    </Router>
  );
}
