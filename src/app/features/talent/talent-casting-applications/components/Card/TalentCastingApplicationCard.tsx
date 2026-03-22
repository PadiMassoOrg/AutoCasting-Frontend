import { Button, Separator } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Chip, StatusChip } from '../../../../../shared/components/Chip';
import { SectionCard } from '../../../../../shared/components/Section';
import { ROUTES } from '../../../../../shared/lib/routes';
import { castingModalityText } from '../../../../../shared/utils/formatUtils';
import type { TalentCastingApplicationCardResponse } from '../../types/talentCastingApplication.types';

const TalentCastingApplicationCard = ({ data }: { data: TalentCastingApplicationCardResponse }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { roleName, castingProjectType, castingModality, castingStatus, castingRoleId, castingSlug } = data;

  const castingDetailsPath = `${ROUTES.PUBLIC_CASTING}/${castingSlug}/roles/${castingRoleId}`;

  const handleCastingDetailsNavigate = () => {
    navigate(castingDetailsPath);
  };

  return (
    <SectionCard className="lg:min-w-[415px]">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center justify-between">
          <h2 className="font-bold min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{roleName}</h2>
          <StatusChip status={castingStatus}></StatusChip>
        </div>
        {/* Employer Stuff */}
        <div className="flex flex-row items-center gap-2 flex-wrap">
          <Chip label={t(castingProjectType.stringCode)}></Chip>
          <Chip label={castingModalityText(castingModality.stringCode, t)}></Chip>
        </div>
        <Separator className="opacity-20 my-2" />
        <Button variant="primary" onClick={handleCastingDetailsNavigate}>
          {t('general.view_details')}
        </Button>
      </div>
    </SectionCard>
  );
};

export default TalentCastingApplicationCard;
