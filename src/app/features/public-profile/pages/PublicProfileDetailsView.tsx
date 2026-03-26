import { DetailsView, Icon, Separator } from 'autocasting-ui-library-padimasso';
import type { JSX } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ImageCarousel from '../../../shared/components/ImageCarousel/ImageCarousel';
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
  if (isLoading || !profile) return null;
  if (error) return <ServerError />;

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

  const url = `${window.location.origin}/profile/${profile.publicSlug}`;

  const headerLeft = (
    <div className="flex flex-col min-w-0">
      <h2 className="text-2xl font-bold truncate">{basicInfo?.stageName}</h2>
      {professions && (
        <span className="flex flex-wrap items-center text-sm text-[var(--color-secondary-grey)]">{professions}</span>
      )}
    </div>
  );

  const headerRight = (
    <Link aria-label={t('profile.share.share_profile')} className="cursor-pointer" to={url}>
      <Icon name="open" variant="primary" />
    </Link>
  );

  return (
    <DetailsView open={open} onClose={onClose} headerLeft={headerLeft} headerRight={headerRight}>
      <div className="flex flex-col gap-6">
        <div className="w-full flex flex-row items-center justify-between">
          <ProfileShareActions data={profile} />
          <SocialMediaSection data={socialMedia} />
        </div>
        <ImageCarousel images={images.length > 0 ? images : null} isDesktop isDesktopXL />
        <Separator className="opacity-20 my-4" />
        <ProfileInfoCarousel profile={profile} infoPanelFixedHeight={true} />
        <Separator className="opacity-20 my-4" />
        <VideoSection data={media} />
      </div>
    </DetailsView>
  );
}
