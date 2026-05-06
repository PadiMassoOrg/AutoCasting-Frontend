import type { DashboardShellSection } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { ProfileSettingsPageShell } from '../../../../shared/components/Settings';
import { EmployerSettingsSecuritySection } from '../components/Section';

const EmployerProfileSettingsPage = () => {
  const { t } = useTranslation();

  const sections: DashboardShellSection[] = [
    {
      key: 'security',
      label: t('settings.pills.security'),
      sectionTitle: t('settings.pills.security'),
      render: () => <EmployerSettingsSecuritySection />,
    },
  ];

  return <ProfileSettingsPageShell sections={sections} />;
};

export default EmployerProfileSettingsPage;
