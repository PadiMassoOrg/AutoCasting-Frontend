import UniversalVideoPlayer from './UniversalVideoPlayer';

const VideoPreviewCard = ({ videoUrl }: { videoUrl: string | null }) => {
  if (!videoUrl) return;
  return (
    <UniversalVideoPlayer
      url={videoUrl}
      // autoplay={false}
      // controls={true}
      // muted={false}
      // loop={false}
      // start={0} // solo YouTube
    />
  );
};

export default VideoPreviewCard;
