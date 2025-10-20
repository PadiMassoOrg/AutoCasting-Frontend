const ChevronUpDown = ({ open }: { open: boolean }) => {
  return (
    <svg
      className={`w-7 transition-transform ${open ? 'rotate-180' : ''}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
};

export default ChevronUpDown;
