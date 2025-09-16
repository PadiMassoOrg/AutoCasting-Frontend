type LayoutProps = {
  children: React.ReactNode;
};

export default function AuthenticationLayout({ children }: LayoutProps) {
  return (
    <div
      className={`
        fixed inset-0 z-0           
        w-[100svw] h-[100svh]       
        lg:w-[100dvw] lg:h-[100dvh] 
        overflow-hidden           
        overscroll-none          
        bg-[var(--color-primary-white)] lg:bg-slate-50
      `}
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
        scrollbarGutter: 'stable both-edges',
      }}
    >
      <div className="w-full h-full grid place-items-center">
        <div className="w-[95%] max-w-[1366px] p-4">{children}</div>
      </div>
    </div>
  );
}
