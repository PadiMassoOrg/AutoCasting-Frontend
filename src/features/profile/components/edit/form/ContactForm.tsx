import { useTranslation } from 'react-i18next';
import type { ProfileContact } from '../../../types/profile.types';
import { FormInputField } from 'autocasting-ui-library-padimasso';
import {
  useCallback,
  useRef,
  useState,
  type ChangeEventHandler,
  type FocusEventHandler,
  type KeyboardEventHandler,
} from 'react';
import { useContactAutosave } from '../../../hooks/autosaves';

export default function ContactForm({ data }: { data: ProfileContact }) {
  const { t } = useTranslation();
  const basicInfoAutosave = useContactAutosave();

  const [email, _] = useState(data.email ?? '');
  const [phoneNumber, setPhoneNumber] = useState(data.phoneNumber ?? '');
  const lastCommittedPhoneNumber = useRef<string>(data.phoneNumber ?? '');

  // Phone Number
  const commitPhoneNumber = useCallback(() => {
    const trimmed = phoneNumber.trim();
    if (trimmed && trimmed !== lastCommittedPhoneNumber.current) {
      lastCommittedPhoneNumber.current = trimmed;
      basicInfoAutosave.immediate({ phoneNumber: trimmed });
    }
  }, [phoneNumber, basicInfoAutosave]);

  const onPhoneNumberChange = useCallback((v: string) => {
    setPhoneNumber(v);
  }, []);

  // Handlers
  const handlePhoneNumberChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    onPhoneNumberChange(e.target.value);
  };

  const handlePhoneNumberKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitPhoneNumber();
    }
  };

  const handlePhoneNumberBlur: FocusEventHandler<HTMLInputElement> = () => {
    commitPhoneNumber();
  };

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
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        onBlur={handlePhoneNumberBlur}
        onKeyDown={handlePhoneNumberKeyDown}
      />
    </div>
  );
}
