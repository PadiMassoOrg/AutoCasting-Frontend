type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <div className="flex flex-col justify-center min-h-screen">
        <div className="w-[95%] max-w-[1366px] m-auto p-4">{children}</div>
      </div>
    </>
  );
}
