type LayoutProps = {
  children: React.ReactNode;
};

export default function NoNavigationLayout({ children }: LayoutProps) {
  return (
    <div
      className={`
        relative z-0
        w-full min-h-[100svh]
        lg:min-h-[100dvh]
        bg-[var(--color-primary-white)] 
      `}
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
        scrollbarGutter: 'stable both-edges',
      }}
    >
      <div className="w-full min-h-[100svh] lg:min-h-[100dvh] flex">
        <div className="w-[95%] max-w-[1366px] p-4 lg:p-0 m-auto">
          <div className="w-full my-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
