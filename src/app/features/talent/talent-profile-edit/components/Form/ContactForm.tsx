import { FormInputField } from 'autocasting-ui-library-padimasso';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TalentProfileContact } from '../../types/talentProfile.types';

export default function ContactForm({ data }: { data: TalentProfileContact }) {
  const { t } = useTranslation();

  const [email, _] = useState(data.email ?? '');

  return (
    <div className="w-full flex flex-col gap-2">
      <h3 className="font-bold text-base">{t('profile.basic_info.contact')}</h3>
      <FormInputField
        id="email"
        label={t('profile.basic_info.email')}
        labelClassName="font-semibold text-base"
        placeholder={t('general.placeholder.email')}
        value={email}
        disabled
        autoComplete="email"
      />
    </div>
  );
}
