import { LG_SCREEN_SIZE, TagChip, useMedia } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { TalentProfilePageModeSwitcher } from '../../talent/talent-profile-edit/components';
import { useOwnTalentProfileNavigation } from '../../talent/talent-profile-edit/hooks/useOwnTalentProfileNavigation';
import type { TalentPublicProfileResponse } from '../../talent/talent-profile-edit/types/talentProfile.types';
import SocialMediaSection from './SocialMediaSection';
import ViewerActions from './ViewerActions';

const BasicInfoSection = ({ data }: { data: TalentPublicProfileResponse }) => {
  const { t } = useTranslation();
  const { basicInfo, socialMedia } = data;
  const isDesktop = useMedia(LG_SCREEN_SIZE);
  const { isOwnPublicProfile, isTalentMode } = useOwnTalentProfileNavigation({
    viewedPublicSlug: data.publicSlug,
  });

  const showEditProfileButton = isDesktop && isTalentMode && isOwnPublicProfile;

  return (
    <article className="flex flex-col w-full gap-1 mb-4 lg:gap-0">
      {isDesktop ? (
        <div className="flex items-center justify-between">
          <div className="flex flex-row items-center gap-10">
            <h2 className="text-[29px] font-bold">{basicInfo.stageName}</h2>
            <ViewerActions className="shrink-0" />
          </div>
          <div className="flex flex-row items-center gap-4">
            <SocialMediaSection data={socialMedia!} />
            {showEditProfileButton && <TalentProfilePageModeSwitcher viewedPublicSlug={data.publicSlug} />}
          </div>
        </div>
      ) : (
        <h2 className="text-[40px] text-center font-bold lg:text-start">{basicInfo.stageName}</h2>
      )}

      <span className="flex flex-wrap items-center justify-center gap-1 font-normal text-sm text-[var(--color-secondary-grey)] lg:justify-start lg:mt-2">
        {basicInfo.professions?.map((profession) => (
          <TagChip key={profession.id} label={t(profession.stringCode ?? '')} />
        ))}
      </span>
    </article>
  );
};

export default BasicInfoSection;
