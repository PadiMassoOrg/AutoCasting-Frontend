import type { ReactNode } from 'react';

type DashboardSectionProps = {
  children: ReactNode;
  className?: string;
};

export default function DashboardSection({ children, className = '' }: DashboardSectionProps) {
  return <section className={`flex flex-col gap-2 pb-14 ${className}`}>{children}</section>;
}
