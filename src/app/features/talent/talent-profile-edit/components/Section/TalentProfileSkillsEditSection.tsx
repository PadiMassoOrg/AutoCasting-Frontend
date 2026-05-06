import { useEffect, useState } from 'react';
import type { SiteMetadataObject } from '../../../../sitemetadata/types/sitemetadata.types';
import { useSkillsAutosave } from '../../hooks/autosaves';
import type { TalentProfileResponse } from '../../types/talentProfile.types';
import GroupedSkills from '../Form/Skills/GroupedSkills';

const TalentProfileSkillsEditSection = ({ profile }: { profile: TalentProfileResponse }) => {
  const autosave = useSkillsAutosave();
  const [skills, setSkills] = useState<SiteMetadataObject[]>(profile.skills ?? []);

  useEffect(() => {
    setSkills(profile.skills ?? []);
  }, [profile.skills]);

  const handleRemoveSkill = (id: string) => {
    const next = skills.filter((s) => s.id !== id);
    setSkills(next);
    autosave.immediate({ skillIds: next.map((s) => s.id) });
  };

  return skills.length > 0 ? <GroupedSkills skills={skills} onRemove={handleRemoveSkill} /> : null;
};

export default TalentProfileSkillsEditSection;
