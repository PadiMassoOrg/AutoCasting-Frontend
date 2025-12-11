import { useTranslation } from 'react-i18next';
import type { CastingRolePublicCardResponse } from '../types/casting-database.types';

type Props = {
  item: CastingRolePublicCardResponse;
  onClick?: () => void;
};

const CastingRolePublicCard = ({ item, onClick }: Props) => {
  const { t } = useTranslation();
  const {
    id,
    name,
    employerCompanyName,
    projectType,
    castingModality,
    location,
    shootingStartDate,
    shootingEndDate,
    professions,
    roleType,
    gender,
    ageMin,
    ageMax,
    defaultCode,
  } = item;
  return <article>{name}</article>;
};

export default CastingRolePublicCard;
