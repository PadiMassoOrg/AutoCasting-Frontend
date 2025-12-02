import { Navigate, Route, Routes } from 'react-router-dom';
import { useMeData } from '../features/auth/hooks/useMeData';
import { OnboardingWizard } from '../features/onboarding/components';
import { TalentProfileEditPage } from '../features/talent/talent-profile-edit/pages';
import { TalentProfileSettingsPage } from '../features/talent/talent-profile-settings/pages';
import { EmptyLayout, ScrollContentLayout } from '../layouts';
import { ROUTES } from '../shared/lib/routes';
import { getAuthToken } from '../shared/lib/cookies';
import { jwtDecoder } from '../shared/utils/jwtDecoder';

export default function ProtectedRoutesLayout() {
  const { data: meData, isLoading } = useMeData();
  const jwt = getAuthToken();
  const decoded = jwt ? jwtDecoder(jwt) : null;
  const publicSlug = decoded?.publicSlug;

  if (isLoading || !meData) {
    return null;
  }

  const effectiveDashboardRoute =
    meData.activeMode === 'EMPLOYER'
      ? ROUTES.EMPLOYER
      : publicSlug
        ? `${ROUTES.PUBLIC_PROFILE}/${publicSlug}`
        : ROUTES.TALENT;

  const needsInitialWizard = meData.activeMode === null;
  const needsTalentWizard = meData.activeMode === 'TALENT' && meData.talentOnboardingStatus !== 'COMPLETED';
  const needsEmployerWizard = meData.activeMode === 'EMPLOYER' && meData.employerOnboardingStatus !== 'COMPLETED';

  const shouldShowWizard = needsInitialWizard || needsTalentWizard || needsEmployerWizard;

  return (
    <Routes>
      {shouldShowWizard ? (
        <>
          <Route element={<EmptyLayout />}>
            <Route path={ROUTES.DASHBOARD} element={<OnboardingWizard />} />
          </Route>
          <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        </>
      ) : (
        <>
          <Route element={<ScrollContentLayout />}>
            <Route path={ROUTES.DASHBOARD} element={<Navigate to={effectiveDashboardRoute} replace />} />
            <Route path={ROUTES.TALENT} element={<TalentProfileEditPage />} />
            <Route path={ROUTES.TALENT_SETTINGS} element={<TalentProfileSettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        </>
      )}
    </Routes>
  );
}
