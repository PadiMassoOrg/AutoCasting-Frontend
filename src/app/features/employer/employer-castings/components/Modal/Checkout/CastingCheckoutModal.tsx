import { Wizard, type WizardStepProps } from 'autocasting-ui-library-padimasso';
import { ServerErrorPage } from '../../../../../../shared/components/ErrorPage';
import { useCastingStatusMutation } from '../../../hooks/status/useCastingStatusMutation';
import { useEmployerCastingCheckoutSummary } from '../../../hooks/useEmployerCastingCheckoutSummary';
import type { EmployerCastingCheckoutSummaryResponse } from '../../../types/employerCastings.types';
import { CastingCheckoutSummaryStep } from './CastingCheckoutSummaryStep';

type CastingCheckoutModalProps = {
  castingId: string;
  slug: string;
  onClose: () => void;
};

type StepSharedProps = WizardStepProps & {
  summary: EmployerCastingCheckoutSummaryResponse;
  onClose: () => void;
  onPublish: () => Promise<void>;
  isPublishing: boolean;
};

const CastingCheckoutModal = ({ castingId, slug, onClose }: CastingCheckoutModalProps) => {
  const { data, isLoading, error } = useEmployerCastingCheckoutSummary(castingId);
  const publishMutation = useCastingStatusMutation('publish');

  const handlePublish = async () => {
    await publishMutation.mutateAsync({ id: castingId, slug });
    onClose();
  };

  if (isLoading) {
    return (
      <div className="flex h-[70dvh] items-center justify-center">
        <p className="text-sm text-(--color-secondary-gray)">Loading...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-[70dvh] items-center justify-center">
        <ServerErrorPage />
      </div>
    );
  }

  return (
    <div className="h-[60dvh]">
      <Wizard className="h-full">
        <CastingCheckoutSummaryStep
          summary={data}
          onClose={onClose}
          onPublish={handlePublish}
          isPublishing={publishMutation.isPending}
        />
      </Wizard>
    </div>
  );
};

export default CastingCheckoutModal;
export type { StepSharedProps };
