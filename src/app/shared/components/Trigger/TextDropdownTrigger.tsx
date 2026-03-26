import { ChevronUpDown } from 'autocasting-ui-library-padimasso';

export const TextDropdownTrigger = ({ label, open }: { label: string; open: boolean }) => (
  <span className="flex items-center gap-1 cursor-pointer select-none">
    <span className="underline font-normal text-sm">{label}</span>
    <span className={open ? 'rotate-180 transition-transform' : 'transition-transform'}>
      <ChevronUpDown open={open} sizePx={18}></ChevronUpDown>
    </span>
  </span>
);
