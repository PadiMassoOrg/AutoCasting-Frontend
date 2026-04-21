import { ButtonRow, Chip, Icon } from 'autocasting-ui-library-padimasso';
import type { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../../../app/shared/lib/routes';
import imagePlaceholder from '../../../shared/icons/image_placeholder.svg';
import type { ProfileCardResponse } from '../types/talent-database.types';

type Props = {
  item: ProfileCardResponse;
  onClick?: () => void;
};

export default function TalentCard({ item, onClick }: Props) {
  const { t } = useTranslation();
  const { publicSlug, stageName, headshotImageUrl, professions } = item;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      window.location.href = ROUTES.PUBLIC_PROFILE + '/' + publicSlug;
    }
  };

  const img = headshotImageUrl || imagePlaceholder;
  const displayedProfessions = (professions ?? []).filter(Boolean).slice(0, 2);

  const handleOpenProfile = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    window.location.href = ROUTES.PUBLIC_PROFILE + '/' + publicSlug;
  };

  return (
    <article
      onClick={handleClick}
      className="
        group w-full h-auto
        sm:w-[280px] md:h-[380px]
        cursor-pointer rounded-xl border border-[var(--color-secondary-outline)] bg-white p-4
        flex flex-col gap-3
      "
    >
      <div
        className="
          relative w-full overflow-hidden rounded-xl
          h-[280px] md:h-full md:group-hover:h-[280px] md:group-focus-within:h-[280px]
        "
      >
        <img src={img} alt={stageName ?? 'profile image'} loading="lazy" className="h-full w-full object-cover" />
        <ButtonRow
          className="
            absolute top-4 right-4 z-10 items-center justify-center
            opacity-100 pointer-events-auto
            md:opacity-0 md:pointer-events-none
            md:group-hover:opacity-100 md:group-hover:pointer-events-auto
            md:group-focus-within:opacity-100 md:group-focus-within:pointer-events-auto
          "
          items={[
            <button key="open-profile" type="button" onClick={handleOpenProfile} aria-label="Open profile">
              <Icon name="open" variant="primary" />
            </button>,
          ]}
        ></ButtonRow>
      </div>
      <div
        className="
          flex flex-col
          opacity-100 max-h-none
          md:opacity-0 md:max-h-0 md:overflow-hidden md:pointer-events-none
          md:group-hover:opacity-100 md:group-hover:max-h-none md:group-hover:pointer-events-auto
          md:group-focus-within:opacity-100 md:group-focus-within:max-h-none md:group-focus-within:pointer-events-auto
        "
      >
        <h3 className="text-2xl sm:text-xl font-semibold leading-tight line-clamp-1">{stageName}</h3>
        <div className="flex flex-wrap gap-2 mt-1">
          {displayedProfessions.map((profession) => (
            <Chip label={t(profession.stringCode)}></Chip>
          ))}
        </div>
      </div>
    </article>
  );
}
