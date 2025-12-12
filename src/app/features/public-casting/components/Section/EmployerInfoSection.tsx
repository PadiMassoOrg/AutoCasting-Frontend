import { Separator } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { Chip } from '../../../../shared/components/Chip/Chip';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { normalizeExternalUrl } from '../../../../shared/utils/formatUtils';
import { getSocialMediaIconName } from '../../../talent/talent-profile-edit/components/Form/SocialMedia/SocialMediaIconMapper';
import type { CastingEmployerPublicInfo } from '../../types/publicCasting.types';

const EmployerInfoSection = ({ data }: { data: CastingEmployerPublicInfo }) => {
  const { t } = useTranslation();

  const socialMediaItems =
    data.socialMedia?.links
      ?.filter((link) => !!link.url && link.url.trim().length > 0)
      .map((link) => {
        const href = normalizeExternalUrl(link.url);
        if (!href) return null;

        const iconName = getSocialMediaIconName(link.stringCode!);
        if (!iconName) return null;

        return (
          <a key={link.optionId} href={href} target="_blank" rel="noopener noreferrer">
            <Icon name={iconName} variant="primary" size={18} />
          </a>
        );
      })
      .filter(Boolean) ?? [];

  return (
    <article className="w-full rounded-xl border border-[var(--color-secondary-outline)] bg-white py-4 px-5 flex flex-col gap-4">
      <div className="flex flex-row items-center gap-2">
        <img src={data.imageUrl!} className="w-14 h-14 rounded-full object-cover"></img>
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">{data.companyName}</h2>
          <Chip label={data.companyType?.stringCode!} t={t} />
        </div>
      </div>
      <Separator className="opacity-20 my-1" />
      <div className="flex flex-col gap-2 text-sm">
        <span className="flex flex-row gap-2 items-center">
          <Icon name={'clapper'} size={18} />
          <p>
            {data.totalCastings} {t('casting-database.page.created_castings')}
          </p>
        </span>
        <span className="flex flex-row gap-2 items-center">
          <Icon name={'profile'} size={18} />
          <p>
            {t('casting-database.page.member_since')} {data.memberSince}
          </p>
        </span>
      </div>
      <div className="mt-8">
        <Separator className="opacity-20 my-3" />
        <div className="flex flex-row justify-end gap-2">{socialMediaItems}</div>
      </div>
    </article>
  );
};

export default EmployerInfoSection;
