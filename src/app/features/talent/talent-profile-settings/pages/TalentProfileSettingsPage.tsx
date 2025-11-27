import { Separator } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { DashboardShell } from '../../../../layouts/components';
import type { DashboardSection } from '../../../../layouts/components/DashboardShell';
import { ChevronRight } from '../../../../shared/components/Chevron';
import { ROUTES } from '../../../../shared/lib/routes';
import { logout } from '../../../auth/services/authService';
import { TalentSettingsSecuritySection } from '../components/Section';

const TalentProfileSettingsPage = () => {
  const { t } = useTranslation();

  const sections: DashboardSection[] = [
    {
      key: 'security',
      label: t('settings.pills.security'),
      render: () => <TalentSettingsSecuritySection />,
    },
    // {
    //   key: 'subscriptions',
    //   label: t('settings.pills.subscriptions'),
    //   render: () => <TalentSettingsSubscriptionsSection />,
    // },
  ];

  const bottomSection = (
    <div className="flex flex-col gap-4 pl-2 py-6 text-sm font-normal text-[var(--color-secondary-disabled-grey)] items-center lg:items-start">
      <Link to={ROUTES.SUPPORT} className="cursor-pointer flex flex-row items-center gap-2">
        {t('routes.support')}
      </Link>
      <Link to={ROUTES.PRIVACY} className="cursor-pointer flex flex-row items-center gap-2">
        {t('routes.privacy')}
      </Link>

      <Link to={ROUTES.TERMS} className="cursor-pointer flex flex-row items-center gap-2">
        {t('routes.terms')}
      </Link>
    </div>
  );

  return (
    <DashboardShell
      title={t('settings.page.title')}
      sections={sections}
      bottomSection={bottomSection}
      initialKey="security"
    />
  );
};

export default TalentProfileSettingsPage;
