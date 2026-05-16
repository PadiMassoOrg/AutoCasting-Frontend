import type { DashboardShellSection } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { ProfileSettingsPageShell } from '../../../../shared/components/Settings';
import { TalentSettingsSecuritySection } from '../components/Section';

const TalentProfileSettingsPage = () => {
  const { t } = useTranslation();

  const sections: DashboardShellSection[] = [
    {
      key: 'security',
      label: t('settings.pills.security'),
      sectionTitle: t('settings.pills.security'),
      render: () => <TalentSettingsSecuritySection />,
    },
    // {
    //   key: 'subscriptions',
    //   label: t('settings.pills.subscriptions'),
    //   render: () => <TalentSettingsSubscriptionsSection />,
    // },
  ];

  return <ProfileSettingsPageShell sections={sections} />;
};

export default TalentProfileSettingsPage;
