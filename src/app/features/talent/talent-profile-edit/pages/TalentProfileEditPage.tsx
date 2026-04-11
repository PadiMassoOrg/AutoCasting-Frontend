import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DashboardShell } from '../../../../layouts/components';
import type { DashboardSection } from '../../../../layouts/components/DashboardShell';
import ServerError from '../../../../shared/components/ServerError/ServerError';
import { formatLastSavedDateTime } from '../../../../shared/utils/formatUtils';
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
  const { t } = useTranslation();
  const { data, error, isLoading } = useTalentProfile();

  useEffect(() => {
    if (data?.modifiedAt) {
      console.log(
        'talent profile modifiedAt',
        data.modifiedAt,
        formatLastSavedDateTime(data.modifiedAt, (key, options) => t(key, options))
      );
    }
  }, [data?.modifiedAt, t]);

  if (isLoading || !data) return null;
  if (error) return <ServerError />;

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
      <TalentProfileModeToggle></TalentProfileModeToggle>
    </div>
  );
}
