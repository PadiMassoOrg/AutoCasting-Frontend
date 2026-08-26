import { SettingsSecuritySection as SharedSettingsSecuritySection } from '../../../auth/change-password/components';

type SettingsSecuritySectionProps = {
  email?: string | null;
  userAccountProvider?: string | null;
};

// Presentational only — SettingsPage owns the profile fetch(es) and loading state, same
// pattern as TalentProfileEditPage's edit sections receiving already-resolved `profile`.
const SettingsSecuritySection = ({ email, userAccountProvider }: SettingsSecuritySectionProps) => {
  if (!email) return null;

  return <SharedSettingsSecuritySection email={email} userAccountProvider={userAccountProvider} />;
};

export default SettingsSecuritySection;
