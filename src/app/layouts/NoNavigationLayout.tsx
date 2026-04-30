import { NoNavigationLayoutShell } from 'autocasting-ui-library-padimasso';

type LayoutProps = {
  children: React.ReactNode;
};

export default function NoNavigationLayout({ children }: LayoutProps) {
  return <NoNavigationLayoutShell mode="flow">{children}</NoNavigationLayoutShell>;
}
