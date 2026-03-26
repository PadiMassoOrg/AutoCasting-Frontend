import { Button } from 'autocasting-ui-library-padimasso';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../../context/ModalContext';
import { DashboardSection } from '../../../../../layouts/components';
import { Icon } from 'autocasting-ui-library-padimasso';
import { SectionCard, SectionTitle } from '../../../../../shared/components/Section';
import { useCachedSiteMetadataOption } from '../../../../sitemetadata/hooks/useCachedSiteMetadata';
import type { SiteMetadataObject } from '../../../../sitemetadata/types/sitemetadata.types';
import { useSkillsAutosave } from '../../hooks/autosaves';
import type { TalentProfileResponse } from '../../types/talentProfile.types';
import GroupedSkills from '../Form/Skills/GroupedSkills';
import { NewSkillModal } from '../Form/Skills/NewSkillModal';

const TalentProfileSkillsEditSection = ({ profile }: { profile: TalentProfileResponse }) => {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModal();
  const autosave = useSkillsAutosave();

  const [skills, setSkills] = useState<SiteMetadataObject[]>(profile.skills ?? []);

  useEffect(() => {
    setSkills(profile.skills ?? []);
  }, [JSON.stringify((profile.skills ?? []).map((s) => s.id))]);

  const skillOptions = useCachedSiteMetadataOption('skills', t);

  const handleOpenModal = () => {
    openModal(
      <NewSkillModal
        initial={skills}
        allOptions={skillOptions}
        onSave={(next) => {
          setSkills(next);
          autosave.immediate({ skillIds: next.map((s) => s.id) });
          closeModal();
        }}
        onCancel={closeModal}
      />,
      t('profile.skills.add_new'),
      'lg'
    );
  };

  const handleRemoveSkill = (id: string) => {
    setSkills((prev) => {
      const next = prev.filter((s) => s.id !== id);
      autosave.immediate({ skillIds: next.map((s) => s.id) });
      return next;
    });
  };

  const actionButtonRender = () => (
    <Button onClick={handleOpenModal} className="flex flex-row items-center justify-center gap-2">
      <Icon name="plus" variant="white" size={16} />
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
