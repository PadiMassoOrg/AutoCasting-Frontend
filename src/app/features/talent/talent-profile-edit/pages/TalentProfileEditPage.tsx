import type { DashboardShellSection } from 'autocasting-ui-library-padimasso';
import { DashboardLoadingLabel, DashboardShell } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import ServerError from '../../../../shared/components/ServerError/ServerError';
import { formatLastSavedDateTime } from '../../../../shared/utils/formatUtils';
import { TalentProfileModeToggle, TalentProfilePageModeSwitcher } from '../components';
import {
  TalentProfileCreditsEditAction,
  TalentProfileEducationEditAction,
  TalentProfileSkillsEditAction,
} from '../components/Action';
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

  if (error && !data) return <ServerError />;

  const loadingSections: DashboardShellSection[] = [
    {
      key: 'basic',
      label: t('profile.pills.basic_info'),
      sectionTitle: t('profile.pills.basic_info'),
      render: () => <DashboardLoadingLabel />,
    },
    {
      key: 'media',
      label: t('profile.pills.media'),
      sectionTitle: t('profile.pills.media'),
      render: () => <DashboardLoadingLabel />,
    },
    {
      key: 'details',
      label: t('profile.pills.characteristics'),
      sectionTitle: t('profile.pills.characteristics'),
      render: () => <DashboardLoadingLabel />,
    },
    {
      key: 'skills',
      label: t('profile.pills.skills'),
      sectionTitle: t('profile.pills.skills'),
      render: () => <DashboardLoadingLabel />,
    },
    {
      key: 'credits',
      label: t('profile.pills.credits'),
      sectionTitle: t('profile.pills.credits'),
      render: () => <DashboardLoadingLabel />,
    },
    {
      key: 'education',
      label: t('profile.pills.education'),
      sectionTitle: t('profile.pills.education'),
      render: () => <DashboardLoadingLabel />,
    },
  ];

  const sections: DashboardShellSection[] =
    isLoading || !data
      ? loadingSections
      : [
          {
            key: 'basic',
            label: t('profile.pills.basic_info'),
            sectionTitle: t('profile.pills.basic_info'),
            render: () => <TalentProfileBasicInfoEditSection profile={data} />,
          },
          {
            key: 'media',
            label: t('profile.pills.media'),
            sectionTitle: t('profile.pills.media'),
            render: () => <TalentProfileMediaEditSection media={data.media} supabaseId={data.id} />,
          },
          {
            key: 'details',
            label: t('profile.pills.characteristics'),
            sectionTitle: t('profile.pills.characteristics'),
            render: () => <TalentProfileDetailsEditSection profile={data} />,
          },
          {
            key: 'skills',
            label: t('profile.pills.skills'),
            sectionTitle: t('profile.pills.skills'),
            sectionActions: <TalentProfileSkillsEditAction initialSkills={data.skills ?? []} />,
            render: () => <TalentProfileSkillsEditSection profile={data} />,
          },
          {
            key: 'credits',
            label: t('profile.pills.credits'),
            sectionTitle: t('profile.pills.credits'),
            sectionActions: <TalentProfileCreditsEditAction />,
            render: () => <TalentProfileCreditsEditSection profile={data} />,
          },
          {
            key: 'education',
            label: t('profile.pills.education'),
            sectionTitle: t('profile.pills.education'),
            sectionActions: <TalentProfileEducationEditAction />,
            render: () => <TalentProfileEducationEditSection profile={data} />,
          },
        ];

  const bottomSectionRenderer = () => {
    if (!data) return;
    return (
      <div className="p-4 text-sm text-(--color-secondary-gray)">
        <p>{t('general.datetime.last_saved')}:</p>
        <p>{formatLastSavedDateTime(data.modifiedAt, t)}</p>
      </div>
    );
  };

  return (
    <div className="relative h-full flex flex-col">
      <div className="flex-1 min-h-0 pb-14 lg:pb-0">
        <DashboardShell
          title={t('profile.page.profile')}
          titleActions={<TalentProfilePageModeSwitcher />}
          sections={sections}
          initialKey="basic"
          bottomSection={bottomSectionRenderer()}
        />
      </div>
      <TalentProfileModeToggle></TalentProfileModeToggle>
    </div>
  );
}
