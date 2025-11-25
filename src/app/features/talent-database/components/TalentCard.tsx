import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../../../app/shared/lib/routes';
import { whatsappLink } from '../../../../app/shared/utils/phoneUtils';
import imagePlaceholder from '../../../shared/icons/image_placeholder.svg';
import type { ProfileCardResponse } from '../types/talent-database.types';

export default function TalentCard({ item }: { item: ProfileCardResponse }) {
  const { t } = useTranslation();
  const { publicSlug, stageName, email, phoneNumber, headshotImageUrl, professions } = item;

  const toPublicProfile = () => {
    window.location.href = ROUTES.PUBLIC_PROFILE + '/' + publicSlug;
  };

  const img = headshotImageUrl || imagePlaceholder;
  const text = stageName
    ? t('profile.share.whatsapp_text', { name: stageName })
    : t('profile.share.whatsapp_text_fallback');
  const waUrl = phoneNumber ? whatsappLink(phoneNumber, text) : null;
  const mailtoUrl = email ? `mailto:${email}` : null;

  return (
    <article
      onClick={toPublicProfile}
      className="
        w-full h-auto
        sm:w-[280px] sm:h-[400px]
        cursor-pointer rounded-xl border border-[var(--color-secondary-outline)] bg-white pt-4 px-4
        flex flex-col justify-between
      "
    >
      {/* Imagen */}
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

      {/* Texto  */}
      <div className="pl-1 flex-1 min-h-25 lg:min-h-0 flex flex-col justify-center">
        <h3 className="text-2xl font-semibold leading-tight line-clamp-1">{stageName}</h3>
        <div className="flex items-start justify-between gap-2 mt-2 pl-1">
          <span className="flex flex-wrap items-center gap-1 text-base font-normal text-[var(--color-secondary-grey)] line-clamp-1">
            {professions?.reduce<JSX.Element[]>((acc, curr, index) => {
              const label = t(curr.stringCode ?? '');
              if (index === 0) return [<span key={curr.id}>{label}</span>];
              return [...acc.slice(-1), <span key={`sep-${index}`}>•</span>, <span key={curr.id}>{label}</span>];
            }, [])}
          </span>
        </div>
      </div>
    </article>
  );
}
