import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import message from '../../../shared/icons/message.svg';
import share from '../../../shared/icons/share.svg';
import { usePublicProfile } from '../hooks/usePublicProfile';

export default function ViewerActions() {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const { data } = usePublicProfile(slug!);

  const url = typeof window !== 'undefined' ? window.location.href : '';
  const waUrl = buildWhatsAppUrl(data?.contact?.phoneNumber, data?.basicInfo?.stageName);
  const mailtoUrl = data?.contact?.email ? `mailto:${data.contact.email}` : null;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: data?.basicInfo?.stageName ?? t('profile.share.profile_no_name'),
          url,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        alert(t('general.copied'));
      } else {
        const ta = document.createElement('textarea');
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        alert(t('general.copied'));
      }
    } catch {
      // Blank on purpose
      // usuario canceló o no hay soporte; silenciar
    }
  };

  return (
    <div className="w-full flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={handleShare}
        className="bg-[var(--color-primary-light-grey)] rounded-md p-3 flex items-center justify-center cursor-pointer"
        aria-label="Compartir perfil"
      >
        <img src={share} alt="" className="w-5" />
      </button>

      {waUrl ? (
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[var(--color-primary-light-grey)] rounded-md p-3 flex items-center justify-center cursor-pointer"
          aria-label="Enviar WhatsApp"
        >
          <img src={message} alt="" className="w-5" />
        </a>
      ) : mailtoUrl ? (
        <a
          href={mailtoUrl}
          className="bg-[var(--color-primary-light-grey)] rounded-md p-3 flex items-center justify-center cursor-pointer"
          aria-label="Enviar email"
        >
          <img src={message} alt="" className="w-5" />
        </a>
      ) : (
        <button
          type="button"
          disabled
          className="bg-[var(--color-primary-light-grey)] rounded-md p-3 flex items-center justify-center opacity-50 cursor-not-allowed"
          title="Sin información de contacto"
          aria-label="Sin información de contacto"
        >
          <img src={message} alt="" className="w-5" />
        </button>
      )}
    </div>
  );
}

// TODO - Mover Helpers
function normalizePhone(raw?: string | null): string | null {
  if (!raw) return null;
  let p = raw.trim().replace(/[^\d+]/g, '');
  if (p.startsWith('00')) p = '+' + p.slice(2);
  return p || null;
}

function buildWhatsAppUrl(phone?: string | null, name?: string | null) {
  const p = normalizePhone(phone);
  if (!p) return null;
  const num = p.replace(/^\+/, '');
  // TODO - Refinar Texto o crear Template en algun lado.
  const text = `Hola ${name ?? ''}, te escribo desde tu perfil de AutoCasting.`;
  return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
}
