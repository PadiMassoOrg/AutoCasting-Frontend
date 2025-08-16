import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ProfileContact } from '../../../types/profile.types';
import { FormInputField } from 'autocasting-ui-library-padimasso';
import { useContactAutosave } from '../../../hooks/autosaves';
import { useCommittedText } from '../../../../../shared/utils/formUtils';

export default function ContactForm({ data }: { data: ProfileContact }) {
  const { t } = useTranslation();
  const contactAutosave = useContactAutosave();

  const [email, _] = useState(data.email ?? '');

  const phoneNumber = useCommittedText(data.phoneNumber ?? '', (v) => contactAutosave.immediate({ phoneNumber: v }), {
    trim: true,
  });

  return (
    <div className="w-full flex flex-col gap-5">
      <h3 className="font-bold text-base">{t('profile.basic_info.contact')}</h3>

      <FormInputField
        id="email"
        label={t('profile.basic_info.email')}
        labelClassName="font-semibold text-base"
        placeholder={t('general.placeholder.email')}
        value={email}
        disabled
      />

      <FormInputField
        id="phoneNumber"
        label={t('profile.basic_info.whatsapp')}
        labelClassName="font-semibold text-base"
        placeholder={t('general.placeholder.phoneNumber')}
        value={phoneNumber.value}
        onChange={phoneNumber.onChange}
        onBlur={phoneNumber.onBlur}
        onKeyDown={phoneNumber.onKeyDown}
      />
    </div>
  );
}
