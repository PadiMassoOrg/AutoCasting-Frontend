import { ROUTES } from '../../../../app/shared/lib/routes';
import { InlineList } from '../../../shared/components/InlineList';
import imagePlaceholder from '../../../shared/icons/image_placeholder.svg';
import type { ProfileCardResponse } from '../types/talent-database.types';

type Props = {
  item: ProfileCardResponse;
  onClick?: () => void;
};

export default function TalentCard({ item, onClick }: Props) {
  const { publicSlug, stageName, headshotImageUrl, professions } = item;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      window.location.href = ROUTES.PUBLIC_PROFILE + '/' + publicSlug;
    }
  };

  const img = headshotImageUrl || imagePlaceholder;

  return (
    <article
      onClick={handleClick}
      className="
        w-full h-auto
        sm:w-[280px] sm:h-[380px]
        cursor-pointer rounded-xl border border-[var(--color-secondary-outline)] bg-white pt-4 px-4
        flex flex-col justify-between
      "
    >
      <div
        className="
          relative w-full overflow-hidden rounded-xl
          min-h-[385px] sm:min-h-0 sm:h-[280px]
        "
      >
        <img
          src={img}
          alt={stageName ?? 'profile image'}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="py-3 flex-1 lg:min-h-0 flex flex-col justify-center gap-1">
        <h3 className="text-2xl sm:text-xl font-semibold leading-tight line-clamp-1">{stageName}</h3>
        <div className="flex items-start justify-between gap-2">
          <InlineList items={professions} quantity={3} />
        </div>
      </div>
    </article>
  );
}
