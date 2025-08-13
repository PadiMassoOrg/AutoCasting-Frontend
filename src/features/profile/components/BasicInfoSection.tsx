import { type JSX } from 'react';
import { useTranslation } from 'react-i18next';
import type { SiteMetadataObject } from '../types/profile.types';

type BasicInfoProps = {
  data: {
    id: string;
    stageName: string;
    gender: string;
    birthDate: string;
    professions: Array<SiteMetadataObject>;
  };
};

const BasicInfoSection = ({ data }: BasicInfoProps) => {
  const { t } = useTranslation();
  const { stageName, professions } = data;

  return (
    <article className="flex flex-col w-full gap-3 mb-4">
      <h2 className="text-[40px] text-center font-bold">{stageName}</h2>
      <span className="flex gap-1 items-center justify-center font-semibold text-sm text-[var(--color-secondary-grey)]">
        {professions.reduce<JSX.Element[]>((acc, curr, index) => {
          if (index === 0) return [<span key={curr.id}>{t(curr.stringCode)}</span>];
          return [
            ...acc,
            <span key={`sep-${index}`} className="mx-1">
              •
            </span>,
            <span key={curr.id}>{t(curr.stringCode)}</span>,
          ];
        }, [])}
      </span>
    </article>
  );
};

export default BasicInfoSection;
