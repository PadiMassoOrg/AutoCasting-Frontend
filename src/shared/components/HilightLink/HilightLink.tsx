import { clsx } from 'clsx';
import { Link, useMatch, useResolvedPath } from 'react-router-dom';
import HilighterSvg from '../../icons/HilighterSvg';

function HilightLink({
  to,
  label,
  className,
  exact = false,
  width = 84,
  height = 36,
}: {
  to: string;
  label: React.ReactNode;
  className?: string;
  exact?: boolean;
  width?: number;
  height?: number;
}) {
  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname + (exact ? '' : '/*'), end: !!exact });
  const active = !!match;

  return (
    <Link
      to={to}
      className={clsx(
        'relative inline-flex items-center justify-center text-black px-1 font-bold text-base',
        'transition-colors',
        className
      )}
    >
      <span className="relative z-10">{label}</span>
      {active && (
        <HilighterSvg
          width={width}
          height={height}
          className="pointer-events-none absolute -z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      )}
    </Link>
  );
}

export default HilightLink;
