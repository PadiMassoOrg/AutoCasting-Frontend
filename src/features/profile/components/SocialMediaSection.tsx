import React from 'react';
import instagram from '../icons/instagram.svg';
import tikTok from '../icons/tikTok.svg';
import { useTranslation } from 'react-i18next';

type SocialMediaProps = {
  data: {
    id: string;
    instagramUrl: string;
    tikTokUrl: string;
  };
};

const SocialMediaSection = ({ data }: SocialMediaProps) => {
  const { t } = useTranslation();
  return (
    <article className="flex flex-col gap-4 items-center">
      <h2 className="text-lg font-bold">{t('profile.page.socials')}:</h2>
      <div className="w-full flex flex-row gap-4 items-center justify-center">
        <span className="bg-[var(--color-primary-light-grey)] rounded-md p-4 flex items-center justify-center cursor-pointer">
          <img src={instagram} alt="share" className="bg-[var(--color-primary-light-grey)] w-5" />
        </span>
        <span className="bg-[var(--color-primary-light-grey)] rounded-md p-4 flex items-center justify-center cursor-pointer">
          <img src={tikTok} alt="share" className="bg-[var(--color-primary-light-grey)] w-5" />
        </span>
      </div>
    </article>
  );
};

export default SocialMediaSection;
