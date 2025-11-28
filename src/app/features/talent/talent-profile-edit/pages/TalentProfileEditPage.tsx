// src/features/talent/talent-profile-edit/pages/TalentProfileEditPage.tsx
import { useTranslation } from 'react-i18next';
import { DashboardShell } from '../../../../layouts/components';
import type { DashboardSection } from '../../../../layouts/components/DashboardShell';
import PageLoading from '../../../../shared/components/PageLoading/PageLoading';
import ServerError from '../../../../shared/components/ServerError/ServerError';
import { LG_SCREEN_SIZE, useMedia } from '../../../../shared/hooks/useMedia';
import { TalentProfileModeToggle } from '../components';
import {
  TalentProfileCreditsEditSection,
  TalentProfileDetailsEditSection,
  TalentProfileEducationEditSection,
  TalentProfileMediaEditSection,
  TalentProfileSkillsEditSection,
} from '../components/Section';
import TalentProfileBasicInfoEditSection from '../components/Section/TalentProfileBasicInfoEditSection';
import { useTalentProfile } from '../hooks/useTalentProfile';

export default function TalentProfileEditPage() {
  const isDesktop = useMedia(LG_SCREEN_SIZE);
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

  return (
    <div className="relative h-full flex flex-col">
      <div className="flex-1 min-h-0">
        <DashboardShell title={t('profile.page.profile')} sections={sections} initialKey="basic" />
      </div>

      {!isDesktop && <TalentProfileModeToggle isEdit publicSlug={data.publicSlug} />}
    </div>
  );
}
