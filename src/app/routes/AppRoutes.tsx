import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import DummyPage from '../features/_TEST_/dummy_page';
import { AuthenticationPage, GoogleAuthSuccessPage, ResetPasswordPage } from '../features/auth/pages';
import MainSiteLayout from '../features/main-site/layout/MainSiteLayout';
import { PrivacyPage, SupportPage, TermsPage } from '../features/main-site/page';
import MainSitePage from '../features/main-site/page/MainSitePage';
import { PublicProfilePage } from '../features/public-profile/pages';
import { TalentDatabasePage } from '../features/talent-database/pages';
import { useRouteTracking } from '../integrations/analytics/routeTracking';
import { NavigationLayout, ScrollContentLayout } from '../layouts';
import { ScrollToTop } from '../shared/components/ScrollToTop/ScrollToTop';
import { ROUTES } from '../shared/lib/routes';
import ProtectedRoute from './ProtectedRoute';
import ProtectedRoutesLayout from './ProtectedRoutesLayout';

function RouteTracker() {
  useRouteTracking();
  return null;
}

export default function AppRoutes() {
  return (
    <Router>
      <RouteTracker />
      <ScrollToTop selector="#app-scroll-root" />
      <Routes>
        <Route element={<MainSiteLayout />}>
          <Route path={ROUTES.HOME} element={<MainSitePage />} />
        </Route>
        {/* Auth */}
        <Route path={ROUTES.AUTH} element={<AuthenticationPage />} />
        <Route path={ROUTES.GOOGLE_OAUTH_SUCCESS} element={<GoogleAuthSuccessPage />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
        {/* Public */}
        <Route element={<MainSiteLayout />}>
          <Route path={ROUTES.SUPPORT} element={<SupportPage />} />
          <Route path={ROUTES.TERMS} element={<TermsPage />} />
          <Route path={ROUTES.PRIVACY} element={<PrivacyPage />} />
        </Route>
        <Route element={<NavigationLayout />}>
          <Route path={ROUTES.PUBLIC_PROFILE + '/:slug'} element={<PublicProfilePage />} />
        </Route>
        <Route element={<ScrollContentLayout />}>
          <Route path={ROUTES.TALENT_DATABASE} element={<TalentDatabasePage />} />
        </Route>
        {/* Protected */}
        <Route
          path={ROUTES.ALL}
          element={
            <ProtectedRoute>
              <ProtectedRoutesLayout />
            </ProtectedRoute>
          }
        />
        {/* _TEST_ */}
        <Route element={<ScrollContentLayout />}>
          <Route path={ROUTES.TALENT_APPLIED_PRODUCTIONS} element={<DummyPage />} />
          <Route path={ROUTES.PRODUCTIONS} element={<DummyPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
