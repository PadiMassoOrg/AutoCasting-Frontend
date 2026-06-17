import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { PageLoading } from 'autocasting-ui-library-padimasso';
import { useAuthToken } from '../features/auth/hooks/useAuthToken';
import { useMeData } from '../features/auth/hooks/useMeData';
import { ScrollContentLayout } from '../layouts';
import { getDashboardRouteForActiveMode, ROUTES } from '../shared/lib/routes';

const EmployerCastingApplicantsPage = lazy(
  () => import('../features/employer/employer-casting-applicants/pages/EmployerCastingApplicantsPage')
);
const EmployerCastingPage = lazy(() => import('../features/employer/employer-castings/pages/EmployerCastingPage'));
const EmployerCastingsPage = lazy(() => import('../features/employer/employer-castings/pages/EmployerCastingsPage'));
const EmployerProfileEditPage = lazy(
  () => import('../features/employer/employer-profile-edit/pages/EmployerProfileEditPage')
);
const EmployerProfileSettingsPage = lazy(
  () => import('../features/employer/employer-profile-settings/pages/EmployerProfileSettingsPage')
);
const TalentCastingApplicationsPage = lazy(
  () => import('../features/talent/talent-casting-applications/pages/TalentCastingApplicationsPage')
);
const TalentProfileEditPage = lazy(() => import('../features/talent/talent-profile-edit/pages/TalentProfileEditPage'));
const TalentProfileSettingsPage = lazy(
  () => import('../features/talent/talent-profile-settings/pages/TalentProfileSettingsPage')
);

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
    <Suspense fallback={<PageLoading />}>
      <Routes>
        <Route element={<ScrollContentLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<Navigate to={effectiveDashboardRoute} replace />} />
          <Route path={ROUTES.TALENT_APPLIED_CASTINGS} element={<TalentCastingApplicationsPage />} />

          {/* Employer */}
          <Route path={ROUTES.EMPLOYER_CASTINGS} element={<EmployerCastingsPage />} />
          <Route
            path={ROUTES.EMPLOYER_CASTING + '/:slug' + '/applicants'}
            element={<EmployerCastingApplicantsPage />}
          />
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
        <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      </Routes>
    </Suspense>
  );
}
