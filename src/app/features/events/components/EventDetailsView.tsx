import { Button, ButtonRow, DetailsView, Icon, ThumbnailImage, showToast } from 'autocasting-ui-library-padimasso';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useDetailsLoadError } from '../../../shared/hooks/useDetailsLoadError';
import { ROUTES } from '../../../shared/lib/routes';
import { formatLocalDate, normalizeExternalUrl } from '../../../shared/utils/formatUtils';
import { shareUrl } from '../../../shared/utils/shareUtils';
import { ENTRY_ACCESS_ONLINE } from '../../sitemetadata/utils/siteMetadataUtils';
import { useEventDetails } from '../hooks/useEventDetails';

type Props = {
  open: boolean;
  onClose: () => void;
  slug?: string | null;
};

function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="py-6">
      <h3 className="text-base font-semibold">{title}</h3>
      <div className="mt-3 text-sm break-words whitespace-pre-line">{children}</div>
    </section>
  );
}

export default function EventDetailsView({ open, onClose, slug }: Props) {
  const { t } = useTranslation();
  const { data: event, error, isLoading } = useEventDetails(slug);

  // Same handling as every details view: a failed load is a toast and the view closes, never an error inside it.
  const hasLoadError = useDetailsLoadError({ error, unavailableMessageKey: 'events.unavailable', onFail: onClose });

  if (!open || hasLoadError) return null;

  const isOnline = event?.entryAccess.stringCode === ENTRY_ACCESS_ONLINE;
  const ticketUrl = isOnline ? normalizeExternalUrl(event?.ticketUrl) : null;
  // Only ONLINE has a ticket page to open; any other entry access is shown as a disabled button with its own label.
  const buttonLabel = event ? (isOnline ? t('events.details.buy_ticket') : t(event.entryAccess.stringCode)) : '';

  const handleShare = async () => {
    await shareUrl({
      url: `${window.location.origin}${ROUTES.EVENTS}/${event?.slug}`,
      onCopied: () => showToast({ title: t('general.copied'), description: t('general.copied'), type: 'default' }),
      onError: () => showToast({ title: t('general.error'), description: t('general.error'), type: 'danger' }),
    });
  };

  const bottomBar = event ? (
    ticketUrl ? (
      <Button asChild variant="primary" className="w-full">
        <a href={ticketUrl} target="_blank" rel="noopener noreferrer">
          {buttonLabel}
        </a>
      </Button>
    ) : (
      <Button disabled className="w-full">
        {buttonLabel}
      </Button>
    )
  ) : undefined;

  return (
    <DetailsView
      open={open}
      onClose={onClose}
      headerLeft={<h2 className="text-2xl font-bold break-words">{event?.name}</h2>}
      loading={isLoading}
      loadingHeaderHeightClassName="h-8"
      bottomBar={bottomBar}
    >
      {event ? (
        <div className="flex flex-col">
          <div className="mb-6">
            <ButtonRow items={[<Icon key="copy-link" name="copyLink" onClick={handleShare} />]} />
          </div>

          <div className="aspect-[77/40] w-full overflow-hidden rounded-xl">
            <ThumbnailImage
              src={event.imageUrl}
              alt={event.name}
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col divide-y divide-(--color-secondary-outline)">
            <div className="flex items-start justify-between gap-6 py-6">
              <h3 className="text-base font-semibold">{t('events.details.dates')}</h3>
              <p className="text-sm text-right">{`${formatLocalDate(event.startDate, 'dayMonth')} - ${formatLocalDate(event.endDate, 'dayMonth')}`}</p>
            </div>

            {event.datesInfo && <DetailSection title={t('events.details.schedule')}>{event.datesInfo}</DetailSection>}

            <DetailSection title={t('events.details.location')}>{event.location}</DetailSection>

            {event.description && (
              <DetailSection title={t('events.details.description')}>{event.description}</DetailSection>
            )}
          </div>
        </div>
      ) : null}
    </DetailsView>
  );
}
