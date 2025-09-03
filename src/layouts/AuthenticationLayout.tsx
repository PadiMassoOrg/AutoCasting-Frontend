type LayoutProps = {
  children: React.ReactNode;
};

export default function AuthenticationLayout({ children }: LayoutProps) {
  return (
    <div
      className="
        w-full min-h-dvh
        bg-[var(--color-primary-white)] lg:bg-slate-50
        overflow-y-auto overscroll-contain  /* permite scroll si se necesita */
      "
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
        scrollbarGutter: 'stable',
      }}
    >
      <div className="flex min-h-dvh">
        <div className="w-[95%] max-w-[1366px] mx-auto my-auto p-4">{children}</div>
      </div>
    </div>
  );
}
