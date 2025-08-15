import type { ProfileBasicInfo } from '../../types/profile.types';

export default function BasicInfoForm({ data }: { data: ProfileBasicInfo }) {
  return (
    <div>
      <h3 className="font-semibold mb-3">Información Básica</h3>
      <pre className="text-xs text-gray-500">{data.stageName}</pre>
    </div>
  );
}
