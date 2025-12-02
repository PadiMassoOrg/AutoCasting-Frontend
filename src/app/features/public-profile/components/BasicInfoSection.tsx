import { type JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { LG_SCREEN_SIZE, useMedia } from '../../../shared/hooks/useMedia';
import { TalentProfileModeToggle } from '../../talent/talent-profile-edit/components';
import type { TalentPublicProfileResponse } from '../../talent/talent-profile-edit/types/talentProfile.types';
import SocialMediaSection from './SocialMediaSection';
import ViewerActions from './ViewerActions';

const BasicInfoSection = ({ data }: { data: TalentPublicProfileResponse }) => {
  const { t } = useTranslation();
  const { basicInfo, socialMedia } = data;
  const isDesktop = useMedia(LG_SCREEN_SIZE);

  return (
    <article className="flex flex-col w-full gap-1 mb-4 lg:gap-0">
      {isDesktop ? (
        <div className="flex items-center justify-between">
          <div className="flex flex-row items-center gap-10">
            <h2 className="text-[42px] font-bold">{basicInfo.stageName}</h2>
            <ViewerActions className="shrink-0" />
          </div>
          <div className="flex flex-row items-center gap-4">
            <SocialMediaSection data={socialMedia!} />
            <TalentProfileModeToggle isOnlyButtons></TalentProfileModeToggle>
          </div>
        </div>
      ) : (
        <h2 className="text-[40px] text-center font-bold lg:text-start">{basicInfo.stageName}</h2>
      )}

      <span
        className={`
        flex gap-1 items-center justify-center flex-wrap font-normal text-sm text-[var(--color-secondary-grey)] text-nowrap
        lg:justify-start lg:ml-1 lg:mt-1
        `}
      >
        {basicInfo.professions?.reduce<JSX.Element[]>((acc, curr, index) => {
          if (index === 0) return [<span key={curr.id}>{t(curr.stringCode ? curr.stringCode : '')}</span>];
          return [
            ...acc,
            <span key={`sep-${index}`} className="mx-1">
              •
            </span>,
            <span key={curr.id}>{t(curr.stringCode ? curr.stringCode : '')}</span>,
          ];
        }, [])}
      </span>
    </article>
  );
};

export default BasicInfoSection;
