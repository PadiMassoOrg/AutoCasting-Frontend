import type { ProfileContact } from '../../types/profile.types';

export default function ContactForm({ data }: { data: ProfileContact }) {
  return (
    <div>
      <h3 className="font-semibold mb-3">Contacto</h3>
      {/* TODO: fields */}
      <pre className="text-xs text-gray-500">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
