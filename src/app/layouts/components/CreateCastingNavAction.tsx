import { Icon } from 'autocasting-ui-library-padimasso';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useCreateEmptyCastingMutation } from '../../features/employer/employer-castings/hooks/useCreateEmptyCastingMutation';

type CreateCastingNavActionProps = {
  active?: boolean;
  className?: string;
  iconClassName?: string;
  onAfterClick?: () => void;
  showLabel?: boolean;
};

export default function CreateCastingNavAction({
  className,
  iconClassName,
  onAfterClick,
  showLabel = true,
}: CreateCastingNavActionProps) {
  const { t } = useTranslation();
  const { mutate: createEmptyCasting, isPending } = useCreateEmptyCastingMutation();

  return (
    <button
      type="button"
      className={clsx('cursor-pointer', className)}
      onClick={() => {
        if (isPending) return;
        createEmptyCasting();
        onAfterClick?.();
      }}
      aria-label={t('employer_castings.page.create_casting')}
      disabled={isPending}
    >
      <span className="flex flex-row items-center gap-2">
        <Icon name="plus" variant={'primary'} className={iconClassName} />
        {showLabel ? t('employer_castings.page.create_casting') : null}
      </span>
    </button>
  );
}
