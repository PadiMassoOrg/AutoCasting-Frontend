import type { DashboardShellSection } from 'autocasting-ui-library-padimasso';
import { DashboardLoadingLabel } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { useEmployerProfile } from '../../employer/employer-profile-edit/hooks/useEmployerProfile';
import { useTalentProfile } from '../../talent/talent-profile-edit/hooks/useTalentProfile';
import { ProfileSettingsPageShell } from '../../../shared/components/Settings';
import { SettingsSecuritySection } from '../components/Section';

// One settings page for the whole account — not mode-specific. A user can be Talent,
// Employer, or both; settings (security, and eventually billing) apply at the account
// level regardless of which mode is currently active, so this never branches on activeMode.
//
// Fetches both profiles directly (same as the two original mode-specific pages each did
// for their own single profile) and uses whichever resolves — email/userAccountProvider
// are the same underlying UserEntity fields regardless of which profile response they came
// from, so either is authoritative. Talent is preferred arbitrarily when both are
// available, since the two are guaranteed identical.
const SettingsPage = () => {
  const { t } = useTranslation();
  const { data: talentData, isLoading: isTalentLoading } = useTalentProfile();
  const { data: employerData, isLoading: isEmployerLoading } = useEmployerProfile();

  const email = talentData?.contact.email ?? employerData?.email;
  const userAccountProvider = talentData?.userAccountProvider ?? employerData?.userAccountProvider;
  const isLoading = !email && (isTalentLoading || isEmployerLoading);

  const loadingSections: DashboardShellSection[] = [
    {
      key: 'security',
      label: t('settings.pills.security'),
      sectionTitle: t('settings.pills.security'),
      render: () => <DashboardLoadingLabel />,
    },
  ];

  const sections: DashboardShellSection[] = isLoading
    ? loadingSections
    : [
        {
          key: 'security',
          label: t('settings.pills.security'),
          sectionTitle: t('settings.pills.security'),
          render: () => <SettingsSecuritySection email={email} userAccountProvider={userAccountProvider} />,
        },
      ];

  return <ProfileSettingsPageShell sections={sections} />;
};

export default SettingsPage;
