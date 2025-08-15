import type { Education } from '../../../types/profile.types';

export default function EducationForm({ data }: { data: Education[] }) {
  return (
    <div>
      <h3 className="font-semibold mb-3">Educación</h3>
      {/* TODO: lista editable de educación */}
      <pre className="text-xs text-gray-500">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
