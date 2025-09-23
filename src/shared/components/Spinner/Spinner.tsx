type SpinnerProps = {
  color?: string;
  strokeWidth?: number;
  className?: string;
  ariaLabel?: string;
  arc?: number;
  speedMs?: number;
};

export default function Spinner({
  color,
  strokeWidth = 2,
  className = 'h-9 w-9',
  ariaLabel = 'Loading...',
  arc = 0.65,
  speedMs = 1300,
}: SpinnerProps) {
  const style = {
    ...(color ? { color } : {}),
    animationDuration: `${speedMs}ms`,
  } as React.CSSProperties;

  const r = 9;
  const C = 2 * Math.PI * r;
  const visible = Math.max(0, Math.min(1, arc)) * C;
  const gap = C - visible;

  return (
    <span
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center ${className}`}
      style={style}
    >
      <svg className="animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <circle
          cx="12"
          cy="12"
          r={r}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${visible} ${gap}`}
          strokeDashoffset={C * 0.25}
        />
      </svg>
      <span className="sr-only">{ariaLabel}</span>
    </span>
  );
}
