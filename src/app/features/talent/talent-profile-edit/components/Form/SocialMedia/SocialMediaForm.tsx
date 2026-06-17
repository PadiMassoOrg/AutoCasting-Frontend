import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Icon } from 'autocasting-ui-library-padimasso';
import { useEffect, useMemo, useRef } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { useToast } from '../../../../../../context/ToastContext';
import { handleBackendLocalFieldOrToastError } from '../../../../../../shared/utils/backendErrorHandling';
import { useSiteMetadataSlice } from '../../../../../sitemetadata/hooks/useSiteMetadataSlice';
import {
  getSocialMediaRowSchema,
  type SocialMediaRowFormKey,
  type SocialMediaRowValues,
} from '../../../schemas/socialMediaSchema';
import type { ProfileSocialMedia } from '../../../types/talentProfile.types';
import SocialMediaRow from './SocialMediaRow';

type SocialMediaFormProps = {
  data: ProfileSocialMedia;
  onSaveLinks: (payload: SocialMediaLinksPayload) => void;
  isLoading?: boolean;
};

type SocialMediaFormValues = {
  links: SocialMediaRowValues[];
};

export type LinkState = {
  optionId: string;
  url: string | null;
};

export type SocialMediaLinksPayload = {
  links: { optionId: string; url: string | null }[];
};

export default function SocialMediaForm({ data, onSaveLinks, isLoading = false }: SocialMediaFormProps) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { data: allOptions = [] } = useSiteMetadataSlice('socialMediaOptions');

  const schema = useMemo(() => z.object({ links: z.array(getSocialMediaRowSchema(t)) }), [t]);

  const defaultLinks = useMemo(
    () =>
      (data.links ?? []).map((link) => ({
        optionId: link.optionId,
        url: link.url ?? '',
      })),
    [data.links]
  );

  const persistedLinksRef = useRef<LinkState[]>(data.links ?? []);

  const {
    control,
    register,
    getValues,
    setValue,
    reset,
    trigger,
    clearErrors,
    setError,
    watch,
    formState: { errors },
  } = useForm<SocialMediaFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { links: defaultLinks },
    mode: 'onBlur',
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'links' });

  const watchedLinks = watch('links');

  useEffect(() => {
    reset({ links: defaultLinks });
    persistedLinksRef.current = data.links ?? [];
  }, [defaultLinks, data.links, reset]);

  const usedIds = useMemo(() => new Set(watchedLinks.map((link) => link.optionId)), [watchedLinks]);

  const initialUrlsById = useMemo(() => {
    const map: Record<string, string | null> = {};
    (data.links ?? []).forEach((l) => {
      map[l.optionId] = l.url ?? null;
    });
    return map;
  }, [data.links]);

  const freeOptions = useMemo(() => allOptions.filter((opt) => !usedIds.has(opt.id)), [allOptions, usedIds]);

  const handleOptionChange = (index: number, nextOptionId: string) => {
    const previousPersistedUrl = initialUrlsById[nextOptionId] ?? null;

    setValue(`links.${index}.optionId`, nextOptionId, { shouldDirty: true, shouldTouch: true });
    setValue(`links.${index}.url`, previousPersistedUrl ?? '', { shouldDirty: false, shouldTouch: false });
    clearErrors(`links.${index}`);
  };

  const handleSaveRow = async (index: number) => {
    const valid = await trigger(`links.${index}.url`);
    if (!valid) return;

    const currentLinks = getValues('links');
    const row = currentLinks[index];
    if (!row) return;

    const trimmedUrl = row.url.trim();
    const nextUrl = trimmedUrl === '' ? null : trimmedUrl;
    const previousRow = persistedLinksRef.current[index];

    if (previousRow?.optionId === row.optionId && (previousRow.url?.trim() ?? '') === trimmedUrl) {
      return;
    }

    const payload: SocialMediaLinksPayload = {
      links: [],
    };

    if (previousRow && previousRow.optionId !== row.optionId) {
      payload.links.push({
        optionId: previousRow.optionId,
        url: null,
      });
    }

    payload.links.push({
      optionId: row.optionId,
      url: nextUrl,
    });

    try {
      if (payload.links.length > 0) {
        onSaveLinks(payload);
      }

      persistedLinksRef.current = currentLinks.map((link) => ({
        optionId: link.optionId,
        url: link.url.trim() === '' ? null : link.url.trim(),
      }));
    } catch (error) {
      handleBackendLocalFieldOrToastError<SocialMediaRowFormKey>({
        error,
        t,
        setFieldError: (field, message) => {
          if (message) {
            setError(`links.${index}.${field}`, { type: 'server', message });
          }
        },
        showToast: (message) =>
          showToast({
            title: t('general.error'),
            description: message,
            type: 'danger',
          }),
      });
    }
  };

  const handleDeleteRow = (index: number) => {
    const currentLinks = getValues('links');
    const row = currentLinks[index];
    if (!row) {
      remove(index);
      return;
    }

    const isUnsavedRow =
      row.url.trim() === '' && !persistedLinksRef.current.some((link) => link.optionId === row.optionId);
    if (isUnsavedRow) {
      remove(index);
      return;
    }

    onSaveLinks({
      links: [
        {
          optionId: row.optionId,
          url: null,
        },
      ],
    });

    remove(index);
    persistedLinksRef.current = persistedLinksRef.current.filter((_, i) => i !== index);
  };

  const handleAddRow = () => {
    if (freeOptions.length === 0) return;
    const firstFree = freeOptions[0];

    append({ optionId: firstFree.id, url: '' });
  };

  return (
    <div className="w-full flex flex-col">
      <h3 className="font-bold text-base mb-4">{t('profile.basic_info.social_media')}</h3>

      <div className="grid grid-cols-1 gap-x-8 lg:grid-cols-2">
        {fields.map((field, index) => (
          <SocialMediaRow
            key={field.id}
            allOptions={allOptions}
            usedOptionIds={usedIds}
            value={{ optionId: watchedLinks[index]?.optionId || '', url: watchedLinks[index]?.url ?? null }}
            urlField={register(`links.${index}.url`)}
            optionIdField={register(`links.${index}.optionId`)}
            errorMessage={errors.links?.[index]?.url?.message}
            onOptionChange={(nextId) => handleOptionChange(index, nextId)}
            onDelete={() => handleDeleteRow(index)}
            onBlur={() => void handleSaveRow(index)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                void handleSaveRow(index);
              }
            }}
          />
        ))}
      </div>

      <Button
        type="button"
        className="mt-2 self-start lg:max-w-[250px] flex flex-row gap-2 items-center justify-center"
        variant={freeOptions.length === 0 ? 'disabled' : 'primaryOutline'}
        loading={isLoading}
        onClick={handleAddRow}
      >
        <Icon name="plus" variant="primary" size={16} /> {t('profile.basic_info.add_social_media')}
      </Button>
    </div>
  );
}
