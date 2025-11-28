import { Button } from 'autocasting-ui-library-padimasso';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSiteMetadataSlice } from '../../../../../sitemetadata/hooks/useSiteMetadataSlice';
import type { TalentProfileSocialMedia } from '../../../types/talentProfile.types';
import SocialMediaRow from './SocialMediaRow';

type SocialMediaFormProps = {
  data: TalentProfileSocialMedia;
};

export type LinkState = {
  optionId: string;
  url: string | null;
};

export default function SocialMediaForm({ data }: SocialMediaFormProps) {
  const { t } = useTranslation();
  const { data: allOptions = [] } = useSiteMetadataSlice('socialMediaOptions');

  const [links, setLinks] = useState<LinkState[]>(() => data.links ?? []);

  useEffect(() => {
    if (!data.links) return;

    setLinks((prev) => {
      const serverLinks = data.links ?? [];
      const serverById = new Map<string, string | null>(serverLinks.map((l) => [l.optionId, l.url ?? null]));

      const ordered: LinkState[] = [];
      prev.forEach((l) => {
        if (serverById.has(l.optionId)) {
          ordered.push({
            optionId: l.optionId,
            url: serverById.get(l.optionId) ?? null,
          });
        }
      });

      const existingIds = new Set(ordered.map((l) => l.optionId));
      serverLinks.forEach((l) => {
        if (!existingIds.has(l.optionId)) {
          ordered.push({
            optionId: l.optionId,
            url: l.url ?? null,
          });
        }
      });

      return ordered;
    });
  }, [data.links]);

  const usedIds = useMemo(() => new Set(links.map((l) => l.optionId)), [links]);

  const initialUrlsById = useMemo(() => {
    const map: Record<string, string | null> = {};
    (data.links ?? []).forEach((l) => {
      map[l.optionId] = l.url ?? null;
    });
    return map;
  }, [data.links]);

  const freeOptions = useMemo(() => allOptions.filter((opt) => !usedIds.has(opt.id)), [allOptions, usedIds]);

  const handleChangeRow = (index: number, next: LinkState) => {
    setLinks((prev) => prev.map((item, i) => (i === index ? next : item)));
  };

  const handleDeleteRow = (index: number) => {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddRow = () => {
    if (freeOptions.length === 0) return;
    const firstFree = freeOptions[0];

    setLinks((prev) => [
      ...prev,
      {
        optionId: firstFree.id,
        url: null,
      },
    ]);
  };

  return (
    <div className="w-full flex flex-col gap-5">
      <h3 className="font-bold text-base">{t('profile.basic_info.social_media')}</h3>

      {links.map((link, index) => (
        <SocialMediaRow
          key={`${link.optionId}-${index}`}
          allOptions={allOptions}
          usedOptionIds={usedIds}
          value={link}
          onChange={(next) => handleChangeRow(index, next)}
          onDelete={() => handleDeleteRow(index)}
          initialUrlsById={initialUrlsById}
        />
      ))}

      <Button
        type="button"
        className="mt-2 self-start lg:max-w-[250px]"
        variant={freeOptions.length === 0 ? 'disabled' : 'primary'}
        onClick={handleAddRow}
      >
        {t('profile.basic_info.add_social_media')}
      </Button>
    </div>
  );
}
