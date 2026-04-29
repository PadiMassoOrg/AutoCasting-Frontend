import { useTranslation } from 'react-i18next';
import {
  DashboardLoadingLabel,
  DashboardSection as DashboardSectionBlock,
  DashboardShell,
} from '../../../../layouts/components';
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

  if (error && !data) return <ServerError />;

  const loadingSections: DashboardSection[] = [
    {
      key: 'basic',
      label: t('profile.pills.basic_info'),
      render: () => (
        <DashboardSectionBlock>
          <DashboardLoadingLabel />
        </DashboardSectionBlock>
      ),
    },
    {
      key: 'media',
      label: t('profile.pills.media'),
      render: () => (
        <DashboardSectionBlock>
          <DashboardLoadingLabel />
        </DashboardSectionBlock>
      ),
    },
    {
      key: 'details',
      label: t('profile.pills.characteristics'),
      render: () => (
        <DashboardSectionBlock>
          <DashboardLoadingLabel />
        </DashboardSectionBlock>
      ),
    },
    {
      key: 'skills',
      label: t('profile.pills.skills'),
      render: () => (
        <DashboardSectionBlock>
          <DashboardLoadingLabel />
        </DashboardSectionBlock>
      ),
    },
    {
      key: 'credits',
      label: t('profile.pills.credits'),
      render: () => (
        <DashboardSectionBlock>
          <DashboardLoadingLabel />
        </DashboardSectionBlock>
      ),
    },
    {
      key: 'education',
      label: t('profile.pills.education'),
      render: () => (
        <DashboardSectionBlock>
          <DashboardLoadingLabel />
        </DashboardSectionBlock>
      ),
    },
  ];

  const sections: DashboardSection[] =
    isLoading || !data
      ? loadingSections
      : [
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

  const bottomSectionRenderer = () => {
    if (!data) return;
    return (
      <div className="text-sm text-(--color-secondary-gray)">
        <p>{t('general.datetime.last_saved')}:</p>
        <p>{formatLastSavedDateTime(data.modifiedAt, t)}</p>
      </div>
    );
  };

  return (
    <div className="relative h-full flex flex-col">
      <div className="flex-1 min-h-0">
        <DashboardShell
          title={t('profile.page.profile')}
          sections={sections}
          initialKey="basic"
          bottomSection={bottomSectionRenderer()}
        />
      </div>
      <TalentProfileModeToggle></TalentProfileModeToggle>
    </div>
  );
}
