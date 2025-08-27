import type { Credit } from '../../../../types/profile.types';

const GroupedCredits = ({ data }: { data: Credit[] }) => {
  console.log(data);
  return <div>GroupedCredits</div>;
};

export default GroupedCredits;
