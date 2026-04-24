import { useTranslation } from 'react-i18next';
import StatusDropdown from '../../../../sitemetadata/component/StatusDropdown';
import { useCachedSiteMetadataOption } from '../../../../sitemetadata/hooks/useCachedSiteMetadata';
import { CASTING_APPLICATION_STATUS_ORDER } from '../../../../sitemetadata/utils/siteMetadataUtils';
import { useCastingApplicationStatusActions } from '../../hooks/status/useCastingApplicationStatusActions';
import type { EmployerCastingApplicantCardResponse } from '../../types/employerCastingApplicants.types';

const CastingApplicantGalleryCard = ({ data }: { data: EmployerCastingApplicantCardResponse }) => {
  const { t } = useTranslation();
  const { applicationId, talentHeadshotImageUrl, talentStageName, castingSlug, applicationStatus } = data;

  const { setStatus, isPending } = useCastingApplicationStatusActions();
  const applicationStatusOptions = useCachedSiteMetadataOption('castingApplicationStatusOptions', t, undefined, {
    raw: true,
  });

  const isMetadataReady = Array.isArray(applicationStatusOptions) && applicationStatusOptions.length > 0;

  const handleSelectApplicationStatus = async (nextStatus: {
    id: string;
    stringCode: string;
    categoryStringCode?: string;
  }) => {
    if (isPending) return;
    await setStatus(nextStatus, { applicationId, castingSlug });
  };

  return (
    <article
      className="
        group w-full h-[400px]
        cursor-pointer
        rounded-xl border border-[var(--color-secondary-outline)] bg-white p-4
        flex flex-col gap-3
      "
    >
      <div
        className="
          relative w-full overflow-hidden rounded-xl transition-all duration-150 ease-in-out
          h-[300px] md:h-full md:group-hover:h-[300px] md:group-focus-within:h-[300px]
        "
      >
        <img
          src={talentHeadshotImageUrl}
          alt={talentStageName ?? 'profile image'}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        {isMetadataReady ? (
          <div
            className="
            absolute top-4 right-4 z-10 items-center justify-center
            transition-all duration-150 ease-in-out
            opacity-100 pointer-events-auto
            md:opacity-0 md:pointer-events-none
            md:group-hover:opacity-100 md:group-hover:pointer-events-auto
            md:group-focus-within:opacity-100 md:group-focus-within:pointer-events-auto
          "
          >
            <StatusDropdown
              value={applicationStatus}
              allOptions={applicationStatusOptions}
              onSelect={handleSelectApplicationStatus}
              order={CASTING_APPLICATION_STATUS_ORDER}
              disabled={isPending}
              menuClassName="!min-w-[120px]"
            />
          </div>
        ) : (
          <div className="h-9 w-32 rounded-md bg-[rgba(0,0,0,0.06)] animate-pulse" />
        )}
      </div>
      <div
        className="
          flex flex-col transition-all duration-150 ease-in-out
          opacity-100 max-h-none
          md:opacity-0 md:max-h-0 md:overflow-hidden md:pointer-events-none
          md:group-hover:opacity-100 md:group-hover:max-h-none md:group-hover:pointer-events-auto
          md:group-focus-within:opacity-100 md:group-focus-within:max-h-none md:group-focus-within:pointer-events-auto
        "
      >
        <h3 className="text-2xl font-semibold">{talentStageName}</h3>
      </div>
    </article>
  );
};

export default CastingApplicantGalleryCard;
