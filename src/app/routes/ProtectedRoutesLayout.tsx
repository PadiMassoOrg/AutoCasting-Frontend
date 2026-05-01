import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuthToken } from '../features/auth/hooks/useAuthToken';
import { useMeData } from '../features/auth/hooks/useMeData';
import EmployerCastingApplicantsPage from '../features/employer/employer-casting-applicants/pages/EmployerCastingApplicantsPage';
import { EmployerCastingPage, EmployerCastingsPage } from '../features/employer/employer-castings/pages';
import { EmployerProfileEditPage } from '../features/employer/employer-profile-edit/pages';
import { EmployerProfileSettingsPage } from '../features/employer/employer-profile-settings/pages';
import { CastingDetailsPage } from '../features/public-casting/pages';
import TalentCastingApplicationsPage from '../features/talent/talent-casting-applications/pages/TalentCastingApplicationsPage';
import { TalentProfileEditPage } from '../features/talent/talent-profile-edit/pages';
import { TalentProfileSettingsPage } from '../features/talent/talent-profile-settings/pages';
import { NavigationLayout, ScrollContentLayout } from '../layouts';
import { getDashboardRouteForActiveMode, ROUTES } from '../shared/lib/routes';

export default function ProtectedRoutesLayout() {
  const token = useAuthToken();
  const { data: meData, isLoading } = useMeData();

  if (!token) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  if (isLoading) {
    return null;
  }

  const effectiveDashboardRoute = getDashboardRouteForActiveMode(meData?.activeMode ?? null);

  return (
    <Routes>
      <Route element={<ScrollContentLayout />}>
        <Route path={ROUTES.DASHBOARD} element={<Navigate to={effectiveDashboardRoute} replace />} />
        <Route path={ROUTES.TALENT_APPLIED_CASTINGS} element={<TalentCastingApplicationsPage />} />

        {/* Employer */}
        <Route path={ROUTES.EMPLOYER_CASTINGS} element={<EmployerCastingsPage />} />
        <Route path={ROUTES.EMPLOYER_CASTING + '/:slug' + '/applicants'} element={<EmployerCastingApplicantsPage />} />
      </Route>
      <Route element={<ScrollContentLayout variant="desktop-full-bleed" />}>
        {/* Talent */}
        <Route path={ROUTES.TALENT} element={<TalentProfileEditPage />} />
        <Route path={ROUTES.TALENT_SETTINGS} element={<TalentProfileSettingsPage />} />

        {/* Employer */}
        <Route path={ROUTES.EMPLOYER} element={<EmployerProfileEditPage />} />
        <Route path={ROUTES.EMPLOYER_CASTING + '/:slug' + '/editor'} element={<EmployerCastingPage />} />
        <Route path={ROUTES.EMPLOYER_SETTINGS} element={<EmployerProfileSettingsPage />} />
      </Route>
      <Route element={<NavigationLayout />}>
        <Route
          path={ROUTES.EMPLOYER_CASTING + '/:slug' + '/details'}
          element={<CastingDetailsPage mode="employer" />}
        />
      </Route>
      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  );
}
