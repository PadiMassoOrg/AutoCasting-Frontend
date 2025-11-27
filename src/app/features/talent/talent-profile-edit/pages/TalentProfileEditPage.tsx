import { useTranslation } from 'react-i18next';
import { DashboardShell } from '../../../../layouts/components';
import type { DashboardSection } from '../../../../layouts/components/DashboardShell';
import PageLoading from '../../../../shared/components/PageLoading/PageLoading';
import ServerError from '../../../../shared/components/ServerError/ServerError';
import TalentProfileBasicInfoEditSection from '../components/Section/TalentProfileBasicInfoEditSection';
import { useTalentProfile } from '../hooks/useTalentProfile';
import {
  TalentProfileCreditsEditSection,
  TalentProfileDetailsEditSection,
  TalentProfileEducationEditSection,
  TalentProfileMediaEditSection,
  TalentProfileSkillsEditSection,
} from '../components/Section';

export default function TalentProfileEditPage() {
  const { t } = useTranslation();
  const { data, isPending, error } = useTalentProfile();

  if (isPending) return <PageLoading />;
  if (error || !data) return <ServerError />;

  const sections: DashboardSection[] = [
    {
      key: 'basic',
      label: t('profile.pills.basic_info'),
      render: () => <TalentProfileBasicInfoEditSection profile={data} />,
    },
    {
      key: 'media',
      label: t('profile.pills.media'),
      render: () => <TalentProfileMediaEditSection media={data.media} supabaseId={data.id} />,
    },
    {
      key: 'details',
      label: t('profile.pills.characteristics'),
      render: () => <TalentProfileDetailsEditSection profile={data} />,
    },
    {
      key: 'skills',
      label: t('profile.pills.skills'),
      render: () => <TalentProfileSkillsEditSection profile={data} />,
    },
    {
      key: 'credits',
      label: t('profile.pills.credits'),
      render: () => <TalentProfileCreditsEditSection profile={data} />,
    },
    {
      key: 'education',
      label: t('profile.pills.education'),
      render: () => <TalentProfileEducationEditSection profile={data} />,
    },
  ];

  return <DashboardShell title={t('profile.page.profile')} sections={sections} initialKey="basic" />;
}
