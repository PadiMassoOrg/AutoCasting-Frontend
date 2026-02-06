import { useTranslation } from 'react-i18next';
import { OverflowMenu } from '../../../../../shared/components/OverflowMenu';
import { TextDropdownTrigger } from '../../../../../shared/components/Trigger/TextDropdownTrigger';

const EmployerCastingsFilterBar = () => {
  const { t } = useTranslation();

  return (
    <section className="flex flex-row items-center justify-between">
      {/* Left Section */}
      <article className="flex flex-row items-center gap-2">
        <OverflowMenu
          items={[]}
          align="start"
          side="bottom"
          trigger={() => <TextDropdownTrigger label={t('general.filter.filter')} open />}
          triggerClassName="px-2 py-1"
          menuClassName="p-0"
        />

        <OverflowMenu
          items={[]}
          align="start"
          side="bottom"
          trigger={() => <TextDropdownTrigger label={t('general.order.order')} open />}
          triggerClassName="px-2 py-1"
        />
      </article>
      {/* Right Section */}
      <article>Hola</article>
    </section>
  );
};

export default EmployerCastingsFilterBar;
