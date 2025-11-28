import { Button } from 'autocasting-ui-library-padimasso';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSiteMetadataSlice } from '../../../../../sitemetadata/hooks/useSiteMetadataSlice';
import type { TalentProfileSocialMedia } from '../../../types/talentProfile.types';
import ExistingSocialMediaRow from './ExistingSocialMediaRow';
import NewSocialMediaRow from './NewSocialMediaRow';

type SocialMediaFormProps = {
  data: TalentProfileSocialMedia;
};

export default function SocialMediaForm({ data }: SocialMediaFormProps) {
  const { t } = useTranslation();
  const { data: allOptions = [] } = useSiteMetadataSlice('socialMediaOptions');

  const usedIds = useMemo(() => new Set(data.links.map((i) => i.optionId)), [data.links]);

  const [showNewRow, setShowNewRow] = useState(false);
  const [pendingOptionId, setPendingOptionId] = useState<string | null>(null);

  const availableForNew = useMemo(() => {
    const base = allOptions.filter((opt) => !usedIds.has(opt.id));
    if (pendingOptionId) {
      return base.filter((opt) => opt.id !== pendingOptionId);
    }
    return base;
  }, [allOptions, usedIds, pendingOptionId]);

  useEffect(() => {
    if (availableForNew.length === 0) {
      setShowNewRow(false);
      setPendingOptionId(null);
    }
  }, [availableForNew.length]);

  return (
    <div className="w-full flex flex-col gap-5">
      <h3 className="font-bold text-base">{t('profile.basic_info.social_media')}</h3>

      {data.links.map((link) => {
        const opt = allOptions.find((o) => o.id === link.optionId);
        return <ExistingSocialMediaRow />;
      })}

      {showNewRow && availableForNew.length > 0 && <NewSocialMediaRow />}

      {!showNewRow && (
        <Button
          type="button"
          className="mt-2 self-start"
          disabled={availableForNew.length === 0}
          onClick={() => {
            setShowNewRow(true);
            setPendingOptionId((prev) => prev ?? availableForNew[0]?.id ?? null);
          }}
        >
          + {t('profile.basic_info.add_social_media')}
        </Button>
      )}
    </div>
  );
}
