import { Button, DetailsView, Icon, ImageCarousel, SectionCard, TagChip } from 'autocasting-ui-library-padimasso';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ServerError from '../../../shared/components/ServerError/ServerError';
import VideoSection from '../../public-profile/components/VideoSection';
import { ProfileShareActions, SocialMediaSection } from '../components';
import { usePublicProfile } from '../hooks/usePublicProfile';
import { SkillsPanel } from '../components/Details';

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
  const skills = profile?.skills ?? [];

  const professions = basicInfo?.professions?.map((p) => (
    <TagChip key={p.id ?? p.stringCode} label={t(p.stringCode!)} />
  ));

  const url = `${window.location.origin}/profile/${profile?.publicSlug ?? ''}`;

  const loadedHeaderLeft = (
    <div className="flex flex-col min-w-0 gap-2">
      <h2 className="text-2xl font-bold truncate">{basicInfo?.stageName}</h2>
      {professions?.length ? <span className="flex flex-wrap items-center gap-1">{professions}</span> : null}
    </div>
  );

  const renderButtonBar = (
    <Link to={url}>
      <Button variant="primary" className="flex flex-row gap-2 items-center">
        {t('profile.page.view_profile')} <Icon name="open" variant="white" />
      </Button>
    </Link>
  );

  return (
    <DetailsView
      open={open}
      onClose={onClose}
      headerLeft={loadedHeaderLeft}
      loading={isLoading}
      loadingHeaderHeightClassName="h-[52px]"
      bottomBar={renderButtonBar}
    >
      <div className="flex flex-col gap-6">
        <div className="w-full flex flex-row items-center justify-between">
          {profile && <ProfileShareActions data={profile} />}
          {socialMedia && <SocialMediaSection data={socialMedia} />}
        </div>
        <ImageCarousel images={images.length > 0 ? images : null} isDesktop isDesktopXL />

        <SectionCard>
          <SkillsPanel skills={skills} />
        </SectionCard>

        <VideoSection data={media!} useGrid />
      </div>
    </DetailsView>
  );
}
