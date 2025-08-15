import type { Media } from '../../../types/profile.types';

const MediaEditSection = ({ media }: { media: Media }) => {
  return (
    <>
      <div>MediaEditSection</div>
      <p>{media.fullBodyImageUrl}</p>
    </>
  );
};

export default MediaEditSection;
