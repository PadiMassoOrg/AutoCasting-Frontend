import { Button } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import type { Education } from '../../../types/profile.types';

const EducationDeleteModal = ({
  education,
  onConfirm,
  onCancel,
}: {
  education: Education;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}) => {
  const { t } = useTranslation();

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
