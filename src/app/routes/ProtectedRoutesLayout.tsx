import { Navigate, Route, Routes } from 'react-router-dom';
import { useMeData } from '../features/auth/hooks/useMeData';
import { EmployerCastingPage, EmployerCastingsPage } from '../features/employer/employer-castings/pages';
import { EmployerProfileEditPage } from '../features/employer/employer-profile-edit/pages';
import { TalentProfileEditPage } from '../features/talent/talent-profile-edit/pages';
import { TalentProfileSettingsPage } from '../features/talent/talent-profile-settings/pages';
import { ScrollContentLayout } from '../layouts';
import { getAuthToken } from '../shared/lib/cookies';
import { ROUTES } from '../shared/lib/routes';
import { jwtDecoder } from '../shared/utils/jwtDecoder';

export default function ProtectedRoutesLayout() {
  const { data: meData, isLoading } = useMeData();
  const jwt = getAuthToken();
  const decoded = jwt ? jwtDecoder(jwt) : null;
  const talentProfileSlug = decoded?.talentProfileSlug;

  if (isLoading || !meData) {
    return null;
  }

  const effectiveDashboardRoute =
    meData.activeMode === 'EMPLOYER'
      ? ROUTES.EMPLOYER
      : talentProfileSlug
        ? `${ROUTES.PUBLIC_PROFILE}/${talentProfileSlug}`
        : ROUTES.TALENT;

  return (
    <Routes>
      <Route element={<ScrollContentLayout />}>
        <Route path={ROUTES.DASHBOARD} element={<Navigate to={effectiveDashboardRoute} replace />} />
        {/* Talent */}
        <Route path={ROUTES.TALENT} element={<TalentProfileEditPage />} />
        <Route path={ROUTES.TALENT_SETTINGS} element={<TalentProfileSettingsPage />} />
        {/* Employer */}
        <Route path={ROUTES.EMPLOYER} element={<EmployerProfileEditPage />} />
        <Route path={ROUTES.EMPLOYER_CASTINGS} element={<EmployerCastingsPage />} />
        <Route path={ROUTES.EMPLOYER_CASTING} element={<EmployerCastingPage />} />
      </Route>
      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  );
}
