import { Route, Routes } from 'react-router-dom';
import type { PublicCastingData } from '../../../public-casting/types/publicCasting.types';
import CastingProposalOverview from './CastingProposalOverview';
import CastingProposalRoleDetails from './CastingProposalRoleDetails';

type Props = {
  preview: unknown;
  onClaim: () => void;
};

export default function CastingProposalPreview({ preview, onClaim }: Props) {
  const casting = preview as PublicCastingData;

  return (
    <Routes>
      <Route index element={<CastingProposalOverview casting={casting} onClaim={onClaim} />} />
      <Route path="roles/:roleId" element={<CastingProposalRoleDetails casting={casting} onClaim={onClaim} />} />
    </Routes>
  );
}
