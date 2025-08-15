import type { ProfileSocialMedia } from '../../types/profile.types';

export default function SocialMediaForm({ data }: { data: ProfileSocialMedia }) {
  return (
    <div>
      <h3 className="font-semibold mb-3">Redes Sociales</h3>
      {/* TODO: fields */}
      <pre className="text-xs text-gray-500">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
