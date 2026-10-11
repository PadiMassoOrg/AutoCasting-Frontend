import { Icon, SectionCard, Separator, ThumbnailImage } from 'autocasting-ui-library-padimasso';
import { toThumbnailUrl } from '../../../shared/lib/thumbnail';
import { formatLocalDate } from '../../../shared/utils/formatUtils';
import type { EventCardResponse } from '../types/events.types';

type Props = {
  item: EventCardResponse;
  onSelect: (item: EventCardResponse) => void;
};

export default function EventCard({ item, onSelect }: Props) {
  const { name, startDate, endDate, datesInfo, location, imageUrl } = item;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    onSelect(item);
  };

  return (
    <SectionCard
      withContentWrapper={false}
      className="cursor-pointer"
      onClick={() => onSelect(item)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="w-full flex flex-col p-4">
        <div className="aspect-[77/40] w-full overflow-hidden rounded-xl">
          <ThumbnailImage
            src={imageUrl}
            thumbnailSrc={toThumbnailUrl(imageUrl)}
            alt={name}
            loading="lazy"
            decoding="async"
            width={640}
            height={332}
            className="h-full w-full object-cover"
          />
        </div>

        <h2 className="mt-2 text-lg font-semibold break-words">{name}</h2>

        <Separator className="opacity-20 my-2" />

        <div className="flex flex-col gap-1">
          <div className="flex gap-1.5">
            <Icon name="calendar" variant="default" />
            <p className="text-sm">{`${formatLocalDate(startDate, 'numeric')} - ${formatLocalDate(endDate, 'numeric')}`}</p>
          </div>
          {datesInfo && (
            <p className="text-sm font-light text-(--color-secondary-grey-fonts) break-words">{datesInfo}</p>
          )}
        </div>

        <div className="mt-2 flex items-start gap-1.5">
          <Icon name="location" variant="default" />
          <p className="min-w-0 text-sm break-words">{location}</p>
        </div>
      </div>
    </SectionCard>
  );
}
