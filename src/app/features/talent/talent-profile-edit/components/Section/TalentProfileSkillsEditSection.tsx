import { Button, DashboardSection, Icon, SectionCard } from 'autocasting-ui-library-padimasso';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../../context/ModalContext';
import { SectionTitle } from '../../../../../shared/components/Section';
import { useCachedSiteMetadataSlice } from '../../../../sitemetadata/hooks/useCachedSiteMetadata';
import type { SiteMetadataObject } from '../../../../sitemetadata/types/sitemetadata.types';
import { useSkillsAutosave } from '../../hooks/autosaves';
import type { TalentProfileResponse } from '../../types/talentProfile.types';
import GroupedSkills from '../Form/Skills/GroupedSkills';
import { NewSkillModal } from '../Form/Skills/NewSkillModal';

const TalentProfileSkillsEditSection = ({ profile }: { profile: TalentProfileResponse }) => {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModal();
  const autosave = useSkillsAutosave();
  const skillsRaw = (useCachedSiteMetadataSlice('skills') as SiteMetadataObject[] | undefined) ?? [];

  const [skills, setSkills] = useState<SiteMetadataObject[]>(profile.skills ?? []);

  const skillsById = useMemo(() => {
    const map = new Map<string, SiteMetadataObject>();
    skillsRaw.forEach((skill) => map.set(skill.id, skill));
    return map;
  }, [skillsRaw]);

  const handleOpenModal = () => {
    openModal(
      <NewSkillModal
        initial={skills}
        onSave={(nextIds) => {
          const nextSkills = nextIds
            .map((id) => skillsById.get(id))
            .filter((skill): skill is SiteMetadataObject => !!skill);
          setSkills(nextSkills);
          autosave.immediate({ skillIds: nextIds });
          closeModal();
        }}
        onCancel={closeModal}
      />,
      t('profile.skills.add_new'),
      'lg'
    );
  };

  const handleRemoveSkill = (id: string) => {
    const next = skills.filter((s) => s.id !== id);
    setSkills(next);
    autosave.immediate({ skillIds: next.map((s) => s.id) });
  };

  const actionButtonRender = () => (
    <Button
      onClick={handleOpenModal}
      variant="primaryOutline"
      className="flex flex-row items-center justify-center gap-2"
    >
      <Icon name="plus" variant="primary" size={16} />
      <span className="text-base font-medium">{t('profile.skills.add_new')}</span>
    </Button>
  );

  return (
    <DashboardSection>
      <SectionTitle title={t('profile.pills.skills')} action={actionButtonRender()} />
      {skills.length > 0 && (
        <SectionCard>
          <GroupedSkills skills={skills} onRemove={handleRemoveSkill} />
        </SectionCard>
      )}
    </DashboardSection>
  );
};

export default TalentProfileSkillsEditSection;
