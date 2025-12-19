import type { ReactNode } from 'react';

type DashboardSectionProps = {
  children: ReactNode;
  className?: string;
};

export default function DashboardSection({ children, className = '' }: DashboardSectionProps) {
  return <section className={`flex flex-col gap-6 pb-20 ${className}`}>{children}</section>;
}
