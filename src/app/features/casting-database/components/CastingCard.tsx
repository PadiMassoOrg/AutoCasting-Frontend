import { useTranslation } from 'react-i18next';
import type { CastingCardResponse } from '../types/casting-database.types';

type Props = {
  item: CastingCardResponse;
  onClick?: () => void;
};

const CastingCard = ({ item, onClick }: Props) => {
  const { t } = useTranslation();
  const { id, title, creationDate, applicationDeadline, projectType } = item;
  return <article>{title}</article>;
};

export default CastingCard;
