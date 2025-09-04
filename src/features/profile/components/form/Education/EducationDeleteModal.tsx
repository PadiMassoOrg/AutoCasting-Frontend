import { Button } from 'autocasting-ui-library-padimasso';
import type { Education } from '../../../types/profile.types';

const EducationDeleteModal = ({
  education,
  onConfirm,
  onCancel,
  t,
}: {
  education: Education;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  t: (k: string) => string;
}) => {
  return (
    <article className="flex flex-col gap-5">
      <p className="text-base">
        {t('profile.education.delete_confirm')}: <strong>{education.courseName}</strong>
      </p>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>
          {t('buttons.cancel')}
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          {t('buttons.delete')}
        </Button>
      </div>
    </article>
  );
};

export default EducationDeleteModal;
