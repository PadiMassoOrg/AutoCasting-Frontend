import type { Credit } from '../../../types/profile.types';

export default function CreditsForm({ data }: { data: Credit[] }) {
  return (
    <div>
      <h3 className="font-semibold mb-3">Créditos</h3>
      {/* TODO: tabla/lista para editar créditos */}
      <pre className="text-xs text-gray-500">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
