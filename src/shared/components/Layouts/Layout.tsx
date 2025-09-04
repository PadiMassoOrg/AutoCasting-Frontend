type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="h-screen w-full bg-[var(--color-primary-white)] lg:bg-slate-50!">
      <div className="flex flex-col justify-center h-full w-[95%] max-w-[1366px] m-auto p-4">{children}</div>
    </div>
  );
}
