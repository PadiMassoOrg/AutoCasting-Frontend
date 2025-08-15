import type { SiteMetadataObject } from '../../../../sitemetadata/types/sitemetadata.types';

export default function SkillsForm({ data }: { data: SiteMetadataObject[] }) {
  return (
    <div>
      <h3 className="font-semibold mb-3">Habilidades</h3>
      {/* TODO: tu SkillsPanel de edición */}
      <pre className="text-xs text-gray-500">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
