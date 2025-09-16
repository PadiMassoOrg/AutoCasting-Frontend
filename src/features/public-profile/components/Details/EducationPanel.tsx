import { useMemo } from 'react';
import type { Education } from '../../../profile-edit/types/profile.types';

const EducationPanel = ({ education }: { education: Education[] }) => {
  const items = useMemo(() => {
    return [...education].sort((a, b) => {
      const ya = Number(a.graduationYear);
      const yb = Number(b.graduationYear);
      if (ya !== yb) return yb - ya;
      return a.institution.localeCompare(b.institution);
    });
  }, [education]);

  if (!items.length) return null;

  return (
    <article className="flex flex-col gap-4">
      {items.map((e) => (
        <div key={e.id} className="rounded-xl border border-[var(--color-secondary-outline)] px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <h4 className="font-semibold text-base lg:text-[14px] leading-snug">{e.courseName}</h4>
            <span className="shrink-0 rounded-lg border border-[var(--color-secondary-outline)] px-3 py-1 text-base lg:text-[14px] lg:text-[14px] font-light tracking-wide">
              {e.graduationYear}
            </span>
          </div>
          <div className="mt-3 text-base lg:text-[14px] font-light text-[var(--color-secondary-grey-fonts)]">
            {e.institution}
          </div>
        </div>
      ))}
    </article>
  );
};

export default EducationPanel;
