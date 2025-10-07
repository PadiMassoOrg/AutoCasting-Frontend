import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import imagePlaceholder from '../../../shared/icons/image_placeholder.svg';
import message from '../../../shared/icons/message.svg';
import { ROUTES } from '../../../shared/lib/routes';
import { whatsappLink } from '../../../shared/utils/phoneUtils';
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
        sm:w-[280px] sm:h-[408px]
        cursor-pointer rounded-xl border border-[var(--color-secondary-outline)] bg-white p-4
        flex flex-col
      "
    >
      {/* Imagen */}
      <div
        className="
          relative w-full overflow-hidden rounded-2xl
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

      {/* Texto y acción */}
      <div className="mt-3 pl-1 flex-1 min-h-0">
        <h3 className="text-2xl font-bold leading-tight line-clamp-1">{stageName}</h3>

        <div className="mt-1 flex items-start justify-between gap-2">
          <span className="flex flex-wrap items-center gap-1 text-base font-normal text-[var(--color-secondary-grey)] line-clamp-1">
            {professions?.reduce<JSX.Element[]>((acc, curr, index) => {
              const label = t(curr.stringCode ?? '');
              if (index === 0) return [<span key={curr.id}>{label}</span>];
              return [...acc.slice(-3), <span key={`sep-${index}`}>•</span>, <span key={curr.id}>{label}</span>];
            }, [])}
          </span>

          <div className="h-12 w-12 shrink-0">
            {waUrl ? (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full items-center justify-center rounded-md bg-[var(--color-primary-light-grey)] p-3"
                aria-label={t('profile.share.whatsapp')}
                title="WhatsApp"
                onClick={(e) => e.stopPropagation()}
              >
                <img src={message} alt="" className="w-5" />
              </a>
            ) : mailtoUrl ? (
              <a
                href={mailtoUrl}
                className="flex h-full items-center justify-center rounded-md bg-[var(--color-primary-light-grey)] p-3"
                aria-label={t('profile.share.email')}
                title="Email"
                onClick={(e) => e.stopPropagation()}
              >
                <img src={message} alt="" className="w-5" />
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="flex h-full cursor-not-allowed items-center justify-center rounded-md p-3 opacity-50"
                title={t('profile.share.no_contact')}
                aria-label={t('profile.share.no_contact')}
                onClick={(e) => e.stopPropagation()}
              >
                <img src={message} alt="" className="w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
