// src/features/talent/talent-profile-edit/components/social-media/ExistingSocialMediaRow.tsx
import { FormInputField } from 'autocasting-ui-library-padimasso';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DeleteIconRed from '../../../../../../shared/icons/delete-red.svg';
import { useCommittedText } from '../../../../../../shared/utils/formUtils';
import type { SiteMetadataObject } from '../../../../../sitemetadata/types/sitemetadata.types';
import { useSocialMediaAutosave } from '../../../hooks/autosaves';
import { getSocialMediaSchema } from '../../../schemas/socialMediaSchema';
import { getSocialMediaIcon } from './SocialMediaIconMapper';

type ExistingRowProps = {
  option: SiteMetadataObject | undefined;
  url: string | null;
  onDelete: () => void;
};

const ExistingSocialMediaRow = ({ option, url, onDelete }: ExistingRowProps) => {
  const { t } = useTranslation();
  const autosave = useSocialMediaAutosave();
  const schema = useMemo(() => getSocialMediaSchema(t), [t]);
  const [error, setError] = useState<string | null>(null);

  if (!option) return null;

  const urlField = useCommittedText(
    url ?? '',
    (v) => {
      const result = schema.shape.url.safeParse(v);
      setError(result.success ? null : (result.error.errors[0]?.message ?? t('validation.url_invalid')));

      if (result.success) {
        const trimmed = v.trim();
        autosave.immediate({
          links: [
            {
              optionId: option.id,
              url: trimmed === '' ? null : trimmed, // "" => delete
            },
          ],
        });
      }
    },
    { trim: true }
  );

  const handleDelete = () => {
    // PATCH para borrar en backend
    autosave.immediate({
      links: [
        {
          optionId: option.id,
          url: null,
        },
      ],
    });
    // Optimista: quitar fila del UI
    onDelete();
  };

  const iconSrc = getSocialMediaIcon(option.stringCode);

  return (
    <div className="flex items-center gap-3 w-full">
      {/* Contenedor grande: icono + separador + input */}
      <div className="flex items-center gap-3 flex-1 rounded-2xl border border-[var(--color-primary-light-grey)] px-4 py-2">
        {/* Icono */}
        {iconSrc && (
          <div className="w-8 h-8 rounded-md bg-[var(--color-primary-light-grey)] flex items-center justify-center">
            <img src={iconSrc} alt="" className="w-5 h-5" />
          </div>
        )}

        {/* Separador vertical */}
        <div className="w-px h-6 bg-[var(--color-primary-light-grey)]" />

        {/* Input URL */}
        <FormInputField
          id={`social-url-${option.id}`}
          className="flex-1 border-none shadow-none focus:ring-0 focus:outline-none"
          placeholder={t('general.placeholder.url')}
          value={urlField.value}
          onChange={urlField.onChange}
          onBlur={urlField.onBlur}
          onKeyDown={urlField.onKeyDown}
          error={error ?? undefined}
        />
      </div>

      {/* Trash clickable */}
      <img src={DeleteIconRed} onClick={handleDelete} className="cursor-pointer" alt={t('general.delete')} />
    </div>
  );
};

export default ExistingSocialMediaRow;
