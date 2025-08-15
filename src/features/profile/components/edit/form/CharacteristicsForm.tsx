import type { Characteristics } from '../../types/profile.types';

export default function CharacteristicsForm({ data }: { data: Characteristics }) {
  return (
    <div>
      <h3 className="font-semibold mb-3">Características</h3>
      {/* TODO: fields */}
      <pre className="text-xs text-gray-500">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
