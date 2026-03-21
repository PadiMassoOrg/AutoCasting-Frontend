import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import type { SiteMetadataObject } from '../../../features/sitemetadata/types/sitemetadata.types';

type Props = {
  items: SiteMetadataObject[];
  quantity?: number;
};

export default function InlineList({ items: list, quantity = 2 }: Props) {
  const { t } = useTranslation();

  const normalized = (list ?? []).filter(Boolean);
  if (normalized.length === 0) return null;

  const q = Math.max(1, quantity);
  const sliced = normalized.slice(0, q);

  return (
    <span className="flex flex-wrap items-center gap-1 text-base sm:text-sm font-normal text-[var(--color-secondary-grey)] line-clamp-1">
      {sliced.reduce<JSX.Element[]>((acc, curr, index) => {
        const label = t(curr.stringCode!);
        if (index === 0) return [<span key={curr.id}>{label}</span>];

        return [...acc, <span key={`sep-${index}`}>•</span>, <span key={curr.id}>{label}</span>];
      }, [])}
    </span>
  );
}
