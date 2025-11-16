import { useTranslation } from 'react-i18next';
import { DashboardShell } from '../../../../layouts/components';
import type { DashboardSection } from '../../../../layouts/components/DashboardShell';
import PageLoading from '../../../../shared/components/PageLoading/PageLoading';
import ServerError from '../../../../shared/components/ServerError/ServerError';
import { DetailsEditSection, MediaEditSection } from '../components/Section';
import TalentProfileEditSection from '../components/Section/TalentProfileEditSection';
import { useTalentProfile } from '../hooks/useTalentProfile';

export default function TalentProfileEditPage() {
  const { t } = useTranslation();
  const { data, isPending, error } = useTalentProfile();

  if (isPending) return <PageLoading />;
  if (error || !data) return <ServerError />;

  const sections: DashboardSection[] = [
    {
      key: 'basic',
      label: t('profile.basic_info.basic_info'),
      render: () => <TalentProfileEditSection profile={data} />,
    },
    {
      key: 'media',
      label: t('profile.media.media'),
      render: () => <MediaEditSection media={data.media} supabaseId={data.id} />,
    },
    {
      key: 'details',
      label: t('profile.characteristics.characteristics'),
      render: () => <DetailsEditSection profile={data} />,
    },
  ];

  return <DashboardShell title={t('profile.page.profile')} sections={sections} initialKey="basic" />;
}
