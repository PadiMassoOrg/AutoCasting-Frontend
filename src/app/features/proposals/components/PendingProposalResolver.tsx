import { usePendingProposal } from '../hooks/usePendingProposal';

export default function PendingProposalResolver() {
  usePendingProposal();
  return null;
}
