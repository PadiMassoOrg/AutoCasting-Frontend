import { Separator } from 'autocasting-ui-library-padimasso';
import type { JSX } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import DetailsView from '../../../shared/components/DetailsView/DetailsView';
import ImageCarousel from '../../../shared/components/ImageCarousel/ImageCarousel';
import openIconPurple from '../../../shared/icons/open-purple.svg';
import ProfileInfoCarousel from '../../public-profile/components/Details/ProfileInfoCarousel';
import VideoSection from '../../public-profile/components/VideoSection';
import type { TalentPublicProfileResponse } from '../../talent/talent-profile-edit/types/talentProfile.types';
import { SocialMediaSection, ViewerActions } from '../components';

type Props = {
  open: boolean;
  onClose: () => void;
  profile?: TalentPublicProfileResponse | null;
};

export default function PublicProfileDetailsView({ open, onClose, profile }: Props) {
  const { t } = useTranslation();

  const images = useMemo(() => {
    const media = profile?.media;
    if (!media) return [];

    return [media.headshotImageUrl, media.fullBodyImageUrl, ...(media.otherPicturesUrl ?? [])].filter(
      (u): u is string => typeof u === 'string' && u.trim().length > 0
    );
  }, [profile]);

  if (!open || !profile) {
    return null;
  }

  const { basicInfo, media, socialMedia } = profile;

  const professions =
    basicInfo?.professions && basicInfo.professions.length > 0
      ? basicInfo.professions.reduce<JSX.Element[]>((acc, curr, index) => {
          const label = t(curr.stringCode ?? '');
          if (!label) return acc;

          if (index === 0) return [<span key={curr.id}>{label}</span>];

          return [
            ...acc,
            <span key={`sep-${index}`} className="mx-1">
              •
            </span>,
            <span key={curr.id}>{label}</span>,
          ];
        }, [])
      : null;

  const headerLeft = (
    <div className="flex flex-col min-w-0">
      <h2 className="text-2xl font-bold truncate">{basicInfo?.stageName}</h2>
      {professions && (
        <span className="flex flex-wrap items-center text-sm text-[var(--color-secondary-grey)]">{professions}</span>
      )}
    </div>
  );

  const url = `${window.location.origin}/profile/${profile.publicSlug}`;

  const headerRight = (
    <a aria-label={t('profile.share.share_profile')} className="cursor-pointer" target="_blank" href={url}>
      <img src={openIconPurple} alt="" className="w-[19px]" />
    </a>
  );

  return (
    <DetailsView open={open} onClose={onClose} headerLeft={headerLeft} headerRight={headerRight}>
      <div className="flex flex-col gap-6">
        <div className="w-full flex flex-row items-center justify-between self-center">
          <ViewerActions></ViewerActions>
          <SocialMediaSection data={socialMedia} className="mt-8" />
        </div>
        <ImageCarousel images={images.length > 0 ? images : null} isDesktop isDesktopXL />
        <Separator className="opacity-20 my-4"></Separator>
        <ProfileInfoCarousel profile={profile} />
        <Separator className="opacity-20 my-4"></Separator>
        <VideoSection data={media} />
      </div>
    </DetailsView>
  );
}
