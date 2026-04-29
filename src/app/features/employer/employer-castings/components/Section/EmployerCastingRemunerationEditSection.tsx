import { Label } from 'autocasting-ui-library-padimasso';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { DashboardLoadingLabel, DashboardSection } from '../../../../../layouts/components';
import { RadioGroupField } from '../../../../../shared/components/Form';
import TextareaField from '../../../../../shared/components/Form/TextareaField';
import { SectionCard, SectionTitle } from '../../../../../shared/components/Section';
import ServerError from '../../../../../shared/components/ServerError/ServerError';
import { useCachedSiteMetadataOption } from '../../../../sitemetadata/hooks/useCachedSiteMetadata';
import { useSyncCastingSectionStatus } from '../../context/useSyncCastingSectionStatus';
import { useCastingRemunerationsSectionAutosave } from '../../hooks/autosaves';
import { useSectionRemunerations } from '../../hooks/section/useSectionRemunerations';
import RoleRemunerationEditCard from '../Form/Remuneration/RoleRemunerationEditCard';

const normalizeNotesForSave = (value: string | null | undefined): string | null => {
  const trimmed = (value ?? '').trim();
  return trimmed.length > 0 ? trimmed : null;
};

const EmployerCastingRemunerationEditSection = ({ sectionId }: { sectionId: string }) => {
  const { data, isLoading, error } = useSectionRemunerations(sectionId);
  const compensationTypeOptions = useCachedSiteMetadataOption('castingCompensationTypeOptions', t);
  const sectionAutosave = useCastingRemunerationsSectionAutosave(sectionId);

  const [notes, setNotes] = useState<string>('');
  const [lastSentNotes, setLastSentNotes] = useState<string | null>(null);

  useEffect(() => {
    const nextNotes = data?.notes ?? '';
    setNotes(nextNotes);
    setLastSentNotes(normalizeNotesForSave(nextNotes));
  }, [data?.id, data?.notes]);

  useSyncCastingSectionStatus('remuneration', data?.sectionStatus);

  if (isLoading || !data) {
    return (
      <DashboardSection>
        <DashboardLoadingLabel />
      </DashboardSection>
    );
  }
  if (error) return <ServerError />;

  const selectedCompensationTypeId = data.compensationType.id;
  const isCollaborative = data.compensationType?.stringCode === 'sitemetadata.compensation_type.collaborative';

  return (
    <DashboardSection>
      <SectionTitle title={t('employer_castings.dashboard.remunerations.title')} />
      {data.remunerations.length > 0 ? (
        <>
          <RadioGroupField
            value={selectedCompensationTypeId}
            options={compensationTypeOptions}
            optionsWrapperClassName="w-full flex flex-row items-center gap-4 lg:gap-8"
            optionClassName="flex items-center gap-2"
            onValueChange={(nextId) => {
              if (!nextId) return;
              if (nextId === selectedCompensationTypeId) return;
              sectionAutosave.immediate({
                id: sectionId,
                castingCompensationTypeId: nextId,
              });
            }}
          />

          {isCollaborative ? (
            <SectionCard>
              <p>{t('employer_castings.dashboard.remunerations.collaborative.description')}</p>

              <div className="min-h-[22px]" />

              <TextareaField
                id="collaborativeNotes"
                label={t('employer_castings.dashboard.remunerations.collaborative.label')}
                placeholder={t('employer_castings.dashboard.remunerations.collaborative.placeholder')}
                value={notes}
                onChange={(e) => setNotes((e?.target?.value ?? '') as string)}
                onBlur={() => {
                  const normalizedNotes = normalizeNotesForSave(notes);
                  if (normalizedNotes === lastSentNotes) return;
                  setLastSentNotes(normalizedNotes);
                  sectionAutosave.immediate({
                    id: sectionId,
                    castingCompensationTypeId: selectedCompensationTypeId,
                    notes: normalizedNotes,
                  });
                }}
              />
            </SectionCard>
          ) : (
            data.remunerations.map((r: any) => {
              return <RoleRemunerationEditCard key={r.id} sectionId={sectionId} data={r} />;
            })
          )}
        </>
      ) : (
        <Label className="w-full text-center text-[var(--color-secondary-grey-fonts)] pt-2 lg:pt-6">
          {t('employer_castings.page.empty_remunerations')}
        </Label>
      )}
    </DashboardSection>
  );
};

export default EmployerCastingRemunerationEditSection;
