import { DetailsView, Icon, ImageCarousel, Separator } from 'autocasting-ui-library-padimasso';
import type { JSX } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ServerError from '../../../shared/components/ServerError/ServerError';
import ProfileInfoCarousel from '../../public-profile/components/Details/ProfileInfoCarousel';
import VideoSection from '../../public-profile/components/VideoSection';
import { ProfileShareActions, SocialMediaSection } from '../components';
import { usePublicProfile } from '../hooks/usePublicProfile';

type Props = {
  open: boolean;
  onClose: () => void;
  publicSlug?: string | null;
};

export default function PublicProfileDetailsView({ open, onClose, publicSlug }: Props) {
  const { t } = useTranslation();
  const { data: profile, error, isLoading } = usePublicProfile(publicSlug, open);

  const images = useMemo(() => {
    const media = profile?.media;
    if (!media) return [];

    return [media.headshotImageUrl, media.fullBodyImageUrl, ...(media.otherPicturesUrl ?? [])].filter(
      (u): u is string => typeof u === 'string' && u.trim().length > 0
    );
  }, [profile]);

  if (!open) return null;
  if (error) return <ServerError />;
  if (!isLoading && !profile) return null;

  const basicInfo = profile?.basicInfo;
  const media = profile?.media;
  const socialMedia = profile?.socialMedia;

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

  const url = `${window.location.origin}/profile/${profile?.publicSlug ?? ''}`;

  const loadedHeaderLeft = (
    <div className="flex flex-col min-w-0">
      <h2 className="text-2xl font-bold truncate">{basicInfo?.stageName}</h2>
      {professions && (
        <span className="flex flex-wrap items-center text-sm text-(--color-secondary-grey)">{professions}</span>
      )}
    </div>
  );

  const headerRight = (
    <Link aria-label={t('profile.share.share_profile')} className="cursor-pointer" to={url}>
      {!isLoading && <Icon name="open" variant="primary" />}
    </Link>
  );

  return (
    <DetailsView
      open={open}
      onClose={onClose}
      headerLeft={loadedHeaderLeft}
      headerRight={headerRight}
      loading={isLoading}
      loadingHeaderHeightClassName="h-[52px]"
    >
      <div className="flex flex-col gap-6">
        <div className="w-full flex flex-row items-center justify-between">
          {profile && <ProfileShareActions data={profile} />}
          {socialMedia && <SocialMediaSection data={socialMedia} />}
        </div>
        <ImageCarousel images={images.length > 0 ? images : null} isDesktop isDesktopXL />
        {profile && <ProfileInfoCarousel profile={profile} infoPanelFixedHeight={true} />}
        <Separator className="opacity-20 my-4" />
        {media && <VideoSection data={media} />}
      </div>
    </DetailsView>
  );
}
