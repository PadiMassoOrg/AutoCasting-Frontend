import { type JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { LG_SCREEN_SIZE, useMedia } from '../../../../shared/hooks/useMedia';
import type { TalentProfileBasicInfo } from '../../talent/talent-profile-edit/types/talentProfile.types';
import ViewerActions from './ViewerActions';

const BasicInfoSection = ({ data }: { data: TalentProfileBasicInfo }) => {
  const { t } = useTranslation();
  const { stageName, professions } = data;
  const isDesktop = useMedia(LG_SCREEN_SIZE);

  return (
    <article className="flex flex-col w-full gap-3 mb-4 lg:gap-0">
      {isDesktop ? (
        <div className="flex items-center gap-6">
          <h2 className="text-[40px] font-bold">{stageName}</h2>
          <ViewerActions className="shrink-0" />
        </div>
      ) : (
        <h2 className="text-[40px] text-center font-bold lg:text-start">{stageName}</h2>
      )}

      <span
        className={`
        flex gap-1 items-center justify-center flex-wrap font-semibold text-sm text-[var(--color-secondary-grey)] text-nowrap
        lg:justify-start lg:ml-1
        `}
      >
        {professions?.reduce<JSX.Element[]>((acc, curr, index) => {
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
