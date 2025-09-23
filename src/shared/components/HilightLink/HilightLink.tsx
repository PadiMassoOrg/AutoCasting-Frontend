import { clsx } from 'clsx';
import { Link, matchPath, useLocation, useResolvedPath } from 'react-router-dom';
import HilighterSvg from '../../icons/HilighterSvg';

type Props = {
  to?: string;
  label: React.ReactNode;
  className?: string;
  exact?: boolean;
  width?: number;
  height?: number;
  activeFor?: string | string[];
  as?: 'link' | 'span';
  onClick?: () => void;
};

function HilightLink({
  to = '/',
  label,
  className,
  exact = false,
  width = 84,
  height = 36,
  activeFor,
  as = 'link',
  onClick,
}: Props) {
  const location = useLocation();
  const base = Array.isArray(activeFor) ? activeFor[0] : (activeFor ?? to);
  const resolved = useResolvedPath(base);
  const candidates = Array.isArray(activeFor) ? activeFor : activeFor ? [activeFor] : [resolved.pathname];

  const active = candidates.some((p) => matchPath({ path: p + (exact ? '' : '/*'), end: !!exact }, location.pathname));

  const common = clsx(
    'relative inline-flex items-center justify-center px-1 font-bold text-base',
    'transition-colors',
    className
  );

  const inner = (
    <>
      <span className="relative z-10">{label}</span>
      {active && (
        <HilighterSvg
          width={width}
          height={height}
          className="pointer-events-none absolute -z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      )}
    </>
  );

  if (as === 'span') {
    return (
      <span className={common} onClick={onClick} role={onClick ? 'button' : undefined}>
        {inner}
      </span>
    );
  }

  return (
    <Link to={to} className={common} onClick={onClick}>
      {inner}
    </Link>
  );
}

export default HilightLink;
