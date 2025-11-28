// src/features/talent/talent-profile-edit/components/social-media/NewSocialMediaRow.tsx
import { FormInputField, FormSelectField } from 'autocasting-ui-library-padimasso';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DeleteIconRed from '../../../../../../shared/icons/delete-red.svg';
import { onSelect, useCommittedText } from '../../../../../../shared/utils/formUtils';
import type { SiteMetadataObject } from '../../../../../sitemetadata/types/sitemetadata.types';
import { useSocialMediaAutosave } from '../../../hooks/autosaves';
import { getSocialMediaSchema } from '../../../schemas/socialMediaSchema';
import { getSocialMediaIcon } from './SocialMediaIconMapper';

type NewRowProps = {
  options: SiteMetadataObject[];
  pendingOptionId: string | null;
  onChangeOption: (id: string | null) => void;
  onDone: () => void;
};

const NewSocialMediaRow = ({ options, pendingOptionId, onChangeOption, onDone }: NewRowProps) => {
  const { t } = useTranslation();
  const autosave = useSocialMediaAutosave();
  const schema = useMemo(() => getSocialMediaSchema(t), [t]);
  const [error, setError] = useState<string | null>(null);

  const selectedOption = options.find((o) => o.id === pendingOptionId) ?? options[0] ?? null;

  const urlField = useCommittedText(
    '',
    (v) => {
      if (!selectedOption) return;
      const result = schema.shape.url.safeParse(v);
      setError(result.success ? null : (result.error.errors[0]?.message ?? t('validation.url_invalid')));

      if (result.success) {
        const trimmed = v.trim();
        if (trimmed === '') return;

        autosave.immediate({
          links: [
            {
              optionId: selectedOption.id,
              url: trimmed,
            },
          ],
        });

        onDone();
      }
    },
    { trim: true }
  );

  const iconSrc = selectedOption ? getSocialMediaIcon(selectedOption.stringCode) : undefined;

  return (
    <div className="flex items-center gap-3 w-full">
      {/* Contenedor grande: icono + dropdown (icon-only) + separador + input */}
      <div className="flex items-center gap-3 flex-1 rounded-2xl border border-[var(--color-primary-light-grey)] px-4 py-2">
        {/* Icono actual */}
        {iconSrc && (
          <div className="w-8 h-8 rounded-md bg-[var(--color-primary-light-grey)] flex items-center justify-center cursor-pointer">
            <img src={iconSrc} alt="" className="w-5 h-5" />
          </div>
        )}

        {/* Dropdown pero sin label visible en el trigger */}
        <FormSelectField
          id="new-social-option"
          value={selectedOption?.id ?? ''}
          onChange={(e) =>
            onSelect((val) => {
              onChangeOption(val || null);
            })(e)
          }
          options={options.map((o) => ({
            value: o.id,
            label: t(o.stringCode), // se verá sólo en la lista desplegada
          }))}
          placeholder=""
          className="min-w-[24px] max-w-[24px] text-transparent cursor-pointer"
        />

        {/* Separador vertical */}
        <div className="w-px h-6 bg-[var(--color-primary-light-grey)]" />

        {/* Input URL */}
        <FormInputField
          id="new-social-url"
          className="flex-1 border-none shadow-none focus:ring-0 focus:outline-none"
          placeholder={t('general.placeholder.url')}
          value={urlField.value}
          onChange={urlField.onChange}
          onBlur={urlField.onBlur}
          onKeyDown={urlField.onKeyDown}
          error={error ?? undefined}
        />
      </div>

      {/* Cancelar fila nueva */}
      <img src={DeleteIconRed} onClick={onDone} className="cursor-pointer" alt={t('general.cancel')} />
    </div>
  );
};

export default NewSocialMediaRow;
