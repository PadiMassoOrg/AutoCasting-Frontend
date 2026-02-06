type ChevronUpDownProps = {
  open: boolean;
  sizePx?: number;
  className?: string;
};

const ChevronUpDown = ({ open, sizePx = 28, className }: ChevronUpDownProps) => {
  return (
    <svg
      width={sizePx}
      height={sizePx}
      className={['transition-transform', open ? 'rotate-180' : '', className ?? ''].filter(Boolean).join(' ')}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
};

export default ChevronUpDown;
